<script setup lang="ts">
import { Clock, MapPin, PhoneCall } from 'lucide-vue-next'
import { onMounted, ref, computed, watch, onUnmounted } from 'vue'

const { data: metadata } = await useFetch('/api/data/metadata')
const { data: citiesData } = await useFetch('/api/data/cities')

const zonesImage = computed(() => {
  return metadata.value?.imageZonesContent || '/img/zones-intervention.png'
})

const schedules = computed(() => {
  return metadata.value?.schedules || 'Lun - Ven - 8h - 19h'
})

const cities = computed(() => {
  return citiesData.value || []
})

const getCityCoords = (cityName: string) => {
  const city = cities.value.find((c: any) => c.name === cityName)
  if (city && city.lat && city.lng) {
    return { lat: city.lat, lng: city.lng }
  }
  return null
}

const mapInstance = ref<any>(null)

const zoomToCity = async (cityName: string) => {
  const coords = getCityCoords(cityName)
  if (coords && mapInstance.value) {
    const map = mapInstance.value
    const L = await import('leaflet')
    
    // Au lieu de faire setView puis panBy (qui est relatif et peut s'accumuler/dériver)
    // On calcule le point cible directement
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const isMobile = !isDesktop
    
    // On convertit les coordonnées géographiques en coordonnées pixels (au niveau de zoom actuel ou cible)
    const targetZoom = 13
    const targetPoint = map.project([(isMobile ? coords.lat + 0.03 : coords.lat), (isMobile ? coords.lng : coords.lng - 0.058)], targetZoom)
    
    // On applique l'offset inverse de ce qu'on veut voir à l'écran
    // Si on veut que le point soit à 75% de la largeur (desktop), on doit décaler le centre de la carte
    // Le centre de la carte est à 50%. Pour que le point soit à 75%, le "centre géographique" doit être décalé de 25% vers la gauche.
    let offsetPoint
    if (isDesktop) {
      offsetPoint = L.point(map.getSize().x * 0.25, 0)
    } else {
      offsetPoint = L.point(0, map.getSize().y * 0.25)
    }
    
    const newCenterPoint = targetPoint.add(offsetPoint)
    const newCenterLatLng = map.unproject(newCenterPoint, targetZoom)
    
    map.setView(newCenterLatLng, targetZoom, {
      animate: true,
      duration: 1
    })
  }
}

onMounted(async () => {
  if (process.client) {
    const L = await import('leaflet')
    import('leaflet/dist/leaflet.css')
    
    const map = L.map('map').setView([43.65, 7.15], 10)
    mapInstance.value = map
    
    let currentTileLayer: any = null

    const updateTileLayer = (isDark: boolean) => {
      const tileLayerUrl = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

      if (currentTileLayer) {
        map.removeLayer(currentTileLayer)
      }

      currentTileLayer = L.tileLayer(tileLayerUrl, {
        attribution: '© OpenStreetMap contributors © CARTO'
      }).addTo(map)
    }

    // Initial tile layer
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    updateTileLayer(mediaQuery.matches)

    // Listen for theme changes
    const themeListener = (e: MediaQueryListEvent) => {
      updateTileLayer(e.matches)
    }
    mediaQuery.addEventListener('change', themeListener)

    onUnmounted(() => {
      mediaQuery.removeEventListener('change', themeListener)
      if (mapInstance.value) {
        mapInstance.value.remove()
      }
    })

    watch(cities, (newCities) => {
      if (newCities && mapInstance.value) {
        updateMarkers(newCities, mapInstance.value, L)
      }
    })

    const points: [number, number][] = []

    const updateMarkers = (citiesList: any[], map: any, leaflet: any) => {
      // Nettoyer les anciens marqueurs si nécessaire (optionnel pour l'instant car l'initialisation suffit)
      citiesList.forEach(city => {
        const coords = city.lat && city.lng ? { lat: city.lat, lng: city.lng } : null
        if (coords) {
          points.push([coords.lat, coords.lng])

          leaflet.circle([coords.lat, coords.lng], {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            radius: 3000,
            weight: 2
          }).addTo(map)
              .bindPopup(`Thierry Azur 06 - ${city.name}`)

          leaflet.marker([coords.lat, coords.lng]).addTo(map)
              .bindPopup(`Thierry Azur 06 - ${city.name}`)
        }
      })
    }

    updateMarkers(cities.value, map, L)

    if (points.length > 0) {
      const bounds = L.latLngBounds(points)
      const isDesktop = window.innerWidth >= 768
        
      map.fitBounds(bounds, { 
        paddingTopLeft: isDesktop ? [window.innerWidth * 0.1, 20] : [20, window.innerHeight * 0.1],
        paddingBottomRight: isDesktop ? [20, 20] : [20, 20]
      })
    }
  }
})
</script>

<template>
  <section id="zones" :class="$style.zones">
    <div :class="$style.container">
      <h2 :class="$style.title">Zones d'intervention</h2>
      
      <div :class="$style.grid">
        <!-- Info Cards -->
        <div :class="$style.infoWrapper">
          <div :class="['glass-card', $style.infoCard]">
            <div :class="$style.iconWrapper">
              <Clock :class="$style.icon" />
            </div>
            <div>
              <h3 :class="$style.infoTitle">Horaires</h3>
              <p :class="$style.infoText">{{ schedules }}</p>
            </div>
          </div>
          
          <div :class="['glass-card', $style.infoCard]">
            <div :class="$style.iconWrapper">
              <MapPin :class="$style.icon" />
            </div>
            <div>
              <h3 :class="$style.infoTitle">Déplacements 06</h3>
              <p :class="$style.infoText">Alpes-Maritimes</p>
            </div>
          </div>
          
          <div :class="['glass-card', $style.infoCard]">
            <div :class="$style.iconWrapper">
              <PhoneCall :class="$style.icon" />
            </div>
            <div>
              <h3 :class="$style.infoTitle">Urgences ponctuelles</h3>
              <p :class="$style.infoText">Selon disponibilité</p>
            </div>
          </div>
        </div>

        <!-- Image and Map area with Overlay Effect -->
        <div :class="$style.mapWrapper">
          <div :class="$style.mapContainer">
            <!-- Background Image (Office) -->
            <img 
              :src="zonesImage" 
              alt="Bureau propre" 
              :class="$style.mapImage"
            />
            
            <!-- Map Container with "Cut-out" effect -->
            <div 
              id="map" 
              :class="$style.mapElement"
            ></div>
            
            <!-- Overlay gradient to blend -->
            <div :class="$style.mapOverlay"></div>
          </div>
          
          <!-- City Tags -->
          <div :class="$style.cityTags">
            <span v-for="city in cities" :key="city.id" 
                  :class="$style.cityTag"
                  @click="zoomToCity(city.name)">
              {{ city.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style module>
.zones {
  padding-top: 6rem; /* py-24 */
  padding-bottom: 6rem;
  background-color: var(--bg-main); /* bg-gray-50 */
}

.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.title {
  font-size: 2.25rem; /* text-4xl */
  font-weight: 700;
  text-align: center;
  color: var(--primary); /* text-blue-900 */
  margin-bottom: 4rem; /* mb-16 */
}

.grid {
  display: grid;
  gap: 2rem;
  align-items: start;
}

.infoWrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.infoCard {
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
}

.iconWrapper {
  padding: 0.75rem;
  background-color: var(--accent); /* bg-blue-100 */
  border-radius: 0.75rem;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary); /* text-blue-600 */
}

.infoTitle {
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.infoText {
  color: var(--text-main); /* text-gray-600 */
}

.mapWrapper {
  position: relative;
}

.mapContainer {
  position: relative;
  height: 450px;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border-color);
}

.mapImage {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.mapElement {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.1);
  clip-path: polygon(0 60%, 100% 40%, 100% 100%, 0 100%);
  min-height: 450px;
}

.mapOverlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent);
  z-index: 20;
}

.cityTags {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.cityTag {
  padding: 0.5rem 1.5rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  color: var(--primary);
  font-weight: 500;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  cursor: pointer;
}

.cityTag:hover {
  box-shadow: 0 8px 20px -2px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  background-color: var(--accent);
}

@media (min-width: 768px) {
  .mapElement {
    width: 85%;
    clip-path: polygon(60% 0, 100% 0%, 100% 100%, 20% 100%);
  }

  .mapOverlay {
    background: linear-gradient(to right, rgba(255, 255, 255, 0.05), transparent);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .mapWrapper {
    grid-column: span 2 / span 2;
  }
}
</style>
