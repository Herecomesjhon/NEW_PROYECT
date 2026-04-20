<script setup>
import { ref, computed } from 'vue'

// --- TABS ---
const tabs = ref([
  { id: 'para-ti', name: 'Para Ti' },
  { id: 'coleccion', name: 'Tu Colección' },
  { id: 'estaciones', name: 'Estaciones en Vivo' },
  { id: 'podcasts', name: 'Podcasts' },
  { id: 'noticias', name: 'Noticias' },
  { id: 'eventos', name: 'Eventos' },
  { id: 'concursos', name: 'Concursos' }
])
const activeTab = ref('para-ti')

// --- TICKER ---
const tickerItems = ref([
  'Banco de México mantiene tasa en 9.5%',
  'Selección Mexicana convocada para eliminatorias',
  'Temperatura récord en Sonora: 48°C',
  'Inauguran nuevo tramo del Tren Maya',
  'Peso mexicano cierra en $17.82 por dólar',
  'Festival Internacional Cervantino anuncia fecha'
])

// --- REPRODUCTOR ---
const isPlaying = ref(false)
const volume = ref(70)

const stations = ref([
  { id: 1, art: 'RN', title: 'Noticias de la Mañana', station: 'Radio Noticias · 98.5 FM', freq: '98.5 FM' },
  { id: 2, art: 'RM', title: 'Éxitos del Rock', station: 'Rock México · 102.1 FM', freq: '102.1 FM' },
  { id: 3, art: 'PO', title: 'Pop Mix', station: 'Pop FM · 95.3 FM', freq: '95.3 FM' }
])

const currentTrackIndex = ref(0)
const currentStation = computed(() => stations.value[currentTrackIndex.value])

const togglePlay = () => { isPlaying.value = !isPlaying.value }
const nextTrack = () => { currentTrackIndex.value = (currentTrackIndex.value + 1) % stations.value.length }
const prevTrack = () => { currentTrackIndex.value = (currentTrackIndex.value - 1 + stations.value.length) % stations.value.length }
const updateVolume = () => { console.log(`Volumen: ${volume.value}%`) }

const selectStation = (station) => {
  const index = stations.value.findIndex(s => s.id === station.id)
  if (index !== -1) {
    currentTrackIndex.value = index
    isPlaying.value = true
  }
}

// --- DATOS DE LAS SECCIONES ---
const paraTiData = ref([
  { id: 1, title: 'Podcast: Historia de México', desc: 'Episodio especial sobre el México antiguo', tag: 'Recomendado' },
  { id: 2, title: 'En vivo: Radio Fórmula', desc: 'Noticias de última hora', tag: 'En Vivo' }
])
const coleccionData = ref([{ id: 1, title: 'Mis favoritos', desc: '12 canciones guardadas' }])
const podcastsData = ref([{ id: 1, title: 'La Historia de México', episodes: 45, duration: '45 min' }])
const noticiasData = ref([{ id: 1, headline: 'Claudia Sheinbaum presenta plan de energía', summary: 'Inversiones en renovables', category: 'Política' }])
const eventosData = ref([{ id: 1, name: 'Vive Latino 2026', date: '15-17 Mayo', location: 'CDMX' }])
const concursosData = ref([{ id: 1, title: 'Gana boletos para Vive Latino', prize: '2 boletos', deadline: '30/04/2026' }])
</script>

<template>
  <div class="app-container">
    <header class="site-header">
      <div class="logo">
        <div class="logo-icon"></div>
        <span class="logo-text">Ondas<span class="logo-accent">MX</span></span>
      </div>
      <div class="live-badge">
        <span class="live-dot"></span>
        <span>EN VIVO</span>
      </div>
    </header>

    <nav class="tabs-nav">
      <div class="tabs-inner">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-btn" 
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id">
          {{ tab.name }}
        </button>
      </div>
    </nav>

    <div class="ticker-wrap">
      <div class="ticker">
        <span v-for="(item, index) in tickerItems" :key="index" class="ticker-item">
          <span class="ticker-dot"></span> {{ item }}
        </span>
      </div>
    </div>

    <section class="player-bar">
      <div class="now-playing">
        <div class="station-art">{{ currentStation.art }}</div>
        <div class="now-info">
          <h2 class="now-title">{{ currentStation.title }}</h2>
          <p class="now-station">{{ currentStation.station }}</p>
          <span class="freq-badge">{{ currentStation.freq }}</span>
        </div>
        <div class="waveform" v-if="isPlaying">
          <span class="wave-bar" v-for="n in 8" :key="n"></span>
        </div>
      </div>

      <div class="player-controls">
        <button class="ctrl-btn" @click="prevTrack">⏮</button>
        <button class="play-btn" @click="togglePlay">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button class="ctrl-btn" @click="nextTrack">⏭</button>
      </div>

      <div class="volume-area">
        <span>🔊</span>
        <input type="range" v-model="volume" @input="updateVolume" min="0" max="100" />
        <span class="vol-label">{{ volume }}%</span>
      </div>
    </section>

    <main class="sections-container">
      <div v-if="activeTab === 'para-ti'" class="section-content">
        <h2>🎧 Recomendado para ti</h2>
        <div class="cards-grid">
          <div class="card" v-for="item in paraTiData" :key="item.id">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <span class="tag">{{ item.tag }}</span>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'estaciones'" class="section-content">
        <h2>📻 Estaciones en Vivo</h2>
        <div class="cards-grid">
          <div class="card" v-for="item in stations" :key="item.id" @click="selectStation(item)">
            <h3>{{ item.title }}</h3>
            <p>{{ item.freq }}</p>
            <span class="tag">▶ Escuchar</span>
          </div>
        </div>
      </div>
      
      </main>

    <footer class="site-footer">
      <p>© 2026 OndasMX. Música y noticias de México.</p>
    </footer>
  </div>
</template>

<style src="/src/assets/main.css" scoped></style>