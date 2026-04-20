<template>
  <div>
    <!-- ===== HEADER ===== -->
    <header class="site-header" role="banner">
      <div class="logo" aria-label="OndasMX">
        <div class="logo-icon" aria-hidden="true"></div>
        <span class="logo-text">Ondas<span class="logo-accent">MX</span></span>
      </div>
      <div class="header-right">
        <div class="live-badge" role="status" aria-live="polite">
          <span class="live-dot" aria-hidden="true"></span>
          <span>EN VIVO</span>
        </div>
        <button @click="cerrarSesion" class="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </header>

    <!-- ===== TABS ===== -->
    <nav class="tabs-nav" role="navigation" aria-label="Secciones principales">
      <div class="tabs-inner">
        <button
          v-for="tab in tabs"
          :key="tab.section"
          class="tab-btn"
          :class="{ active: activeSection === tab.section }"
          type="button"
          @click="activeSection = tab.section"
        >
          {{ tab.label }}
        </button>
      </div>
    </nav>

    <!-- ===== TICKER ===== -->
    <div class="ticker-wrap" role="marquee" aria-label="Noticias de última hora">
      <div class="ticker">
        <span v-for="(item, i) in [...tickerItems, ...tickerItems]" :key="i" class="ticker-item">
          <span class="ticker-dot" aria-hidden="true"></span>{{ item }}
        </span>
      </div>
    </div>

    <!-- ===== PLAYER BAR ===== -->
    <section class="player-bar" aria-label="Reproductor de radio">
      <div class="now-playing">
        <div
          class="station-art"
          :style="{ background: currentStation.color }"
          aria-hidden="true"
        >{{ currentStation.abbr }}</div>
        <div class="now-info">
          <h2 class="now-title">{{ currentStation.prog }}</h2>
          <p class="now-station">{{ currentStation.name }} · {{ currentStation.freq }}</p>
          <span class="freq-badge">{{ currentStation.freq }}</span>
        </div>
        <div class="waveform" :class="{ paused: !isPlaying }" aria-label="Onda de audio" role="img">
          <span v-for="n in 8" :key="n" class="wave-bar"></span>
        </div>
      </div>
      <div class="player-controls" role="group" aria-label="Controles">
        <button class="ctrl-btn" type="button" aria-label="Anterior" @click="prevStation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
        </button>
        <button class="play-btn" type="button" :aria-label="isPlaying ? 'Pausar' : 'Reproducir'" :aria-pressed="isPlaying" @click="togglePlay">
          <svg v-if="!isPlaying" width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        </button>
        <button class="ctrl-btn" type="button" aria-label="Siguiente" @click="nextStation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </button>
      </div>
      <div class="volume-area" role="group" aria-label="Volumen">
        <svg class="vol-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        <input type="range" id="volRange" min="0" max="100" v-model="volume" @input="onVolumeChange" aria-label="Volumen" />
        <span class="vol-label">{{ volume }}%</span>
      </div>
      <audio ref="audioEl" :src="currentStation.stream" preload="none" @error="onAudioError"></audio>
    </section>

    <!-- ===== SECCIONES ===== -->

    <!-- PARA TI -->
    <section v-show="activeSection === 'para-ti'" class="page-section" aria-label="Para Ti">
      <div class="main-layout">
        <main class="news-feed" role="main">
          <div class="section-header">
            <h2 class="section-title">Para Ti</h2>
            <div class="filter-tabs" role="group" aria-label="Categoría">
              <button
                v-for="cat in categories"
                :key="cat.value"
                class="filter-tab"
                :class="{ active: activeFilter === cat.value }"
                type="button"
                @click="activeFilter = cat.value"
              >{{ cat.label }}</button>
            </div>
          </div>

          <article class="featured-card">
            <div class="featured-img" role="img" aria-label="Imagen destacada">
              <span class="feat-circle feat-circle-1" aria-hidden="true"></span>
              <span class="feat-circle feat-circle-2" aria-hidden="true"></span>
              <span class="breaking-tag">🔴 Última Hora</span>
              <span class="featured-img-icon" aria-hidden="true">🌎</span>
            </div>
            <div class="featured-content">
              <h3>Cumbre de Seguridad Latinoamericana convoca a 18 naciones en Ciudad de México</h3>
              <p>Jefes de Estado y cancilleres se reúnen para abordar crimen organizado, migración y cooperación policial transfronteriza.</p>
              <div class="card-meta">
                <span class="cat-badge cat-politica">Política</span>
                <time datetime="2026-03-15T08:03">hace 12 min</time>
              </div>
              <div class="card-actions">
                <button class="ai-summary-btn" type="button" @click="toggleSummary('aiFeatured', 'Cumbre de Seguridad Latinoamericana convoca a 18 naciones en CDMX')">✦ Resumen IA</button>
                <button class="save-news-btn" type="button" @click="saveNews('featured', 'Cumbre de Seguridad Latinoamericana en CDMX', 'politica')">🔖 Guardar</button>
              </div>
              <div v-if="summaries['aiFeatured']" class="ai-response" aria-live="polite">
                <span v-if="summaries['aiFeatured'] === 'loading'" class="ai-loading">✦ Generando resumen…</span>
                <span v-else>{{ summaries['aiFeatured'] }}</span>
              </div>
            </div>
          </article>

          <section class="news-list" aria-label="Noticias">
            <article
              v-for="news in filteredNews"
              :key="news.id"
              class="news-item"
              :data-cat="news.cat"
            >
              <div class="news-item-body">
                <div class="card-meta">
                  <span class="cat-badge" :class="`cat-${news.cat}`">{{ news.catLabel }}</span>
                  <time>{{ news.time }}</time>
                </div>
                <h3>{{ news.title }}</h3>
                <div class="card-actions">
                  <button class="ai-summary-btn" type="button" @click="toggleSummary(news.id, news.title)">✦ Resumen IA</button>
                  <button class="save-news-btn" type="button" @click="saveNews(news.id, news.title, news.cat)">🔖 Guardar</button>
                </div>
                <div v-if="summaries[news.id]" class="ai-response" aria-live="polite">
                  <span v-if="summaries[news.id] === 'loading'" class="ai-loading">✦ Generando resumen…</span>
                  <span v-else>{{ summaries[news.id] }}</span>
                </div>
              </div>
              <div class="news-item-thumb" :class="`thumb-${news.cat}`" role="img">{{ news.icon }}</div>
            </article>
          </section>
        </main>

        <aside class="sidebar" aria-label="Panel lateral">
          <section>
            <h2 class="section-title">Estaciones</h2>
            <ul class="stations-list" role="list">
              <li v-for="station in stations" :key="station.id">
                <div class="station-row">
                  <button
                    class="station-item"
                    :class="{ active: currentStation.id === station.id }"
                    type="button"
                    :aria-pressed="currentStation.id === station.id"
                    @click="selectStation(station)"
                  >
                    <span class="station-logo" :style="{ background: station.color }">{{ station.abbr }}</span>
                    <span class="station-info">
                      <span class="station-name">{{ station.name }}</span>
                      <span class="station-freq">{{ station.freq }}</span>
                    </span>
                    <span class="station-playing" v-if="currentStation.id === station.id && isPlaying">
                      <span v-for="n in 4" :key="n" class="s-bar"></span>
                    </span>
                  </button>
                  <button class="fav-btn" type="button" :class="{ active: isFav('radio', station.id) }" @click="toggleFav('radio', station)" aria-label="Favorito">
                    {{ isFav('radio', station.id) ? '♥' : '♡' }}
                  </button>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 class="section-title">Tendencias</h2>
            <ol class="trending-list" role="list">
              <li v-for="trend in trending" :key="trend.num" class="trend-item">
                <span class="trend-num" :class="{ hot: trend.num <= 2 }">{{ trend.num }}</span>
                <div class="trend-content">
                  <p class="trend-title">{{ trend.title }}</p>
                  <p class="trend-meta">{{ trend.meta }}</p>
                </div>
              </li>
            </ol>
          </section>

          <section class="ai-chat-section">
            <div class="ai-chat-box">
              <h2 class="ai-chat-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Asistente IA
              </h2>
              <div class="chat-messages" ref="chatMessages" role="log" aria-live="polite">
                <div v-for="(msg, i) in chatHistory" :key="i" class="chat-msg" :class="msg.role === 'ai' ? 'chat-msg--ai' : 'chat-msg--user'">
                  {{ msg.text }}
                </div>
                <div v-if="chatLoading" class="chat-msg chat-msg--ai ai-loading">✦ Pensando…</div>
              </div>
              <div class="chat-input-area">
                <input
                  type="text"
                  class="chat-input"
                  placeholder="¿Qué quieres saber?"
                  v-model="chatInput"
                  @keyup.enter="sendChat"
                  autocomplete="off"
                />
                <button type="button" class="chat-send" aria-label="Enviar" @click="sendChat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>

    <!-- TU COLECCIÓN -->
    <section v-show="activeSection === 'coleccion'" class="page-section" aria-label="Tu Colección">
      <div class="coleccion-layout">
        <div class="coleccion-block">
          <div class="coleccion-header">
            <h2 class="section-title">Radios Favoritas</h2>
            <p class="coleccion-hint">Presiona ♡ en cualquier estación para guardarla aquí</p>
          </div>
          <ul class="fav-grid" role="list">
            <li v-if="favRadios.length === 0" class="fav-empty">
              <span class="fav-empty-icon">📻</span>
              <p>Aún no tienes radios favoritas.</p>
              <p>Ve a <strong>Estaciones en Vivo</strong> y presiona ♡</p>
            </li>
            <li v-for="radio in favRadios" :key="radio.id" class="fav-card">
              <button class="fav-card-play" @click="selectStation(radio)">
                <span class="fav-card-art" :style="{ background: radio.color }">{{ radio.abbr }}</span>
                <span class="fav-card-name">{{ radio.name }}</span>
                <span class="fav-card-freq">{{ radio.freq }}</span>
              </button>
              <button class="fav-remove" @click="toggleFav('radio', radio)" aria-label="Eliminar">✕</button>
            </li>
          </ul>
        </div>
        <div class="coleccion-block">
          <div class="coleccion-header">
            <h2 class="section-title">Noticias Guardadas</h2>
            <p class="coleccion-hint">Presiona 🔖 en cualquier noticia para guardarla aquí</p>
          </div>
          <ul class="fav-news-list" role="list">
            <li v-if="savedNews.length === 0" class="fav-empty">
              <span class="fav-empty-icon">📰</span>
              <p>Aún no tienes noticias guardadas.</p>
              <p>Ve a <strong>Noticias</strong> y presiona 🔖</p>
            </li>
            <li v-for="news in savedNews" :key="news.id" class="saved-news-item">
              <span class="cat-badge" :class="`cat-${news.cat}`">{{ news.cat }}</span>
              <span class="saved-news-title">{{ news.title }}</span>
              <button class="fav-remove" @click="removeSavedNews(news.id)" aria-label="Eliminar">✕</button>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ESTACIONES EN VIVO -->
    <section v-show="activeSection === 'estaciones'" class="page-section" aria-label="Estaciones en Vivo">
      <div class="estaciones-layout">
        <h2 class="section-title">Estaciones en Vivo</h2>
        <div class="estaciones-grid">
          <div v-for="station in stations" :key="station.id" class="estacion-card">
            <button class="ecard-play" type="button" @click="selectStation(station)" :aria-label="`Reproducir ${station.name}`">
              <div class="ecard-art" :style="{ background: station.color }">{{ station.abbr }}</div>
              <div class="ecard-info">
                <strong>{{ station.name }}</strong>
                <span>{{ station.freq }}</span>
                <span class="ecard-genre">{{ station.genre }}</span>
              </div>
            </button>
            <button class="fav-btn fav-btn--card" type="button" :class="{ active: isFav('radio', station.id) }" @click="toggleFav('radio', station)" aria-label="Favorito">
              {{ isFav('radio', station.id) ? '♥' : '♡' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- NOTICIAS -->
    <section v-show="activeSection === 'noticias'" class="page-section" aria-label="Noticias">
      <div class="main-layout">
        <main class="news-feed" role="main">
          <div class="section-header">
            <h2 class="section-title">Noticias</h2>
            <div class="filter-tabs" role="group">
              <button
                v-for="cat in categories"
                :key="cat.value"
                class="filter-tab"
                :class="{ active: activeFilter2 === cat.value }"
                type="button"
                @click="activeFilter2 = cat.value"
              >{{ cat.label }}</button>
            </div>
          </div>
          <section class="news-list">
            <article v-for="news in filteredNews2" :key="news.id" class="news-item">
              <div class="news-item-body">
                <div class="card-meta">
                  <span class="cat-badge" :class="`cat-${news.cat}`">{{ news.catLabel }}</span>
                  <time>{{ news.time }}</time>
                </div>
                <h3>{{ news.title }}</h3>
                <div class="card-actions">
                  <button class="ai-summary-btn" type="button" @click="toggleSummary('n2_' + news.id, news.title)">✦ Resumen IA</button>
                  <button class="save-news-btn" type="button" @click="saveNews(news.id, news.title, news.cat)">🔖 Guardar</button>
                </div>
                <div v-if="summaries['n2_' + news.id]" class="ai-response">
                  <span v-if="summaries['n2_' + news.id] === 'loading'" class="ai-loading">✦ Generando resumen…</span>
                  <span v-else>{{ summaries['n2_' + news.id] }}</span>
                </div>
              </div>
              <div class="news-item-thumb" :class="`thumb-${news.cat}`">{{ news.icon }}</div>
            </article>
          </section>
        </main>
        <aside class="sidebar">
          <section>
            <h2 class="section-title">Tendencias</h2>
            <ol class="trending-list">
              <li v-for="trend in trending" :key="trend.num" class="trend-item">
                <span class="trend-num" :class="{ hot: trend.num <= 2 }">{{ trend.num }}</span>
                <div class="trend-content">
                  <p class="trend-title">{{ trend.title }}</p>
                  <p class="trend-meta">{{ trend.meta }}</p>
                </div>
              </li>
            </ol>
          </section>
        </aside>
      </div>
    </section>

    <!-- PODCASTS / EVENTOS / CONCURSOS -->
    <section v-show="activeSection === 'podcasts'" class="page-section">
      <div class="simple-page"><h2 class="section-title">Podcasts</h2><div class="coming-soon"><span>🎙️</span><p>Próximamente</p><p class="coming-sub">Los mejores podcasts de México en un solo lugar.</p></div></div>
    </section>
    <section v-show="activeSection === 'eventos'" class="page-section">
      <div class="simple-page"><h2 class="section-title">Eventos</h2><div class="coming-soon"><span>🎤</span><p>Próximamente</p><p class="coming-sub">Conciertos, transmisiones especiales y más.</p></div></div>
    </section>
    <section v-show="activeSection === 'concursos'" class="page-section">
      <div class="simple-page"><h2 class="section-title">Concursos</h2><div class="coming-soon"><span>🏆</span><p>Próximamente</p><p class="coming-sub">Participa y gana premios con OndasMX.</p></div></div>
    </section>

    <!-- FOOTER -->
    <footer class="site-footer" role="contentinfo">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="logo"><div class="logo-icon"></div><span class="logo-text">Ondas<span class="logo-accent">MX</span></span></div>
          <p>Música, radio y noticias de México,<br>todo en un solo lugar.</p>
          <div class="footer-social">
            <a href="#" aria-label="Facebook" class="social-link">f</a>
            <a href="#" aria-label="X" class="social-link">𝕏</a>
            <a href="#" aria-label="Instagram" class="social-link">◎</a>
          </div>
        </div>
        <nav class="footer-nav"><h3>EXPLORAR</h3><ul><li><a href="#">OndasMX</a></li><li><a href="#">Estaciones en Vivo</a></li><li><a href="#">Podcasts</a></li></ul></nav>
        <nav class="footer-nav"><h3>EXCLUSIVO</h3><ul><li><a href="#">Noticias</a></li><li><a href="#">Eventos</a></li><li><a href="#">Concursos</a></li></ul></nav>
        <nav class="footer-nav"><h3>INFORMACIÓN</h3><ul><li><a href="#">Acerca de</a></li><li><a href="#">Anúnciate</a></li><li><a href="#">Trabajos</a></li></ul></nav>
      </div>
      <div class="footer-bottom">
        <p>© 2026 OndasMX. Todos los derechos reservados.</p>
        <div class="footer-legal"><a href="#">Ayuda</a><a href="#">Privacidad</a><a href="#">Términos de Uso</a></div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// ─── ROUTER / SESIÓN ──────────────────────────────────────────────────────────
const router = useRouter()
const cerrarSesion = () => {
  localStorage.removeItem('user_logged_in')
  router.push('/')
}

// ─── AUDIO ────────────────────────────────────────────────────────────────────
const audioEl   = ref(null)
const isPlaying = ref(false)
const volume    = ref(70)

const stations = ref([
  {
    id: 'radio-noticias',
    name: 'Radio Noticias',
    freq: '98.5 FM',
    prog: 'Noticias de la Mañana',
    abbr: 'RN',
    color: 'linear-gradient(135deg,#7C3AED,#EC4899)',
    genre: 'Noticias',
    stream: 'https://stream.zeno.fm/0r0xa792kwzuv',
  },
  {
    id: 'capital-fm',
    name: 'Capital FM',
    freq: '90.3 FM',
    prog: 'Jazz & Blues en Vivo',
    abbr: 'CF',
    color: 'linear-gradient(135deg,#0D9488,#3B82F6)',
    genre: 'Jazz',
    stream: 'https://stream.zeno.fm/your-capital-stream',
  },
  {
    id: 'alfa-radio',
    name: 'Alfa Radio',
    freq: '91.3 FM',
    prog: 'Rock Clásico Mexicano',
    abbr: 'AR',
    color: 'linear-gradient(135deg,#F97316,#FBBF24)',
    genre: 'Rock',
    stream: 'https://stream.zeno.fm/your-alfa-stream',
  },
  {
    id: 'opus-94',
    name: 'Opus 94',
    freq: '94.5 FM',
    prog: 'Música Clásica & Ópera',
    abbr: 'OP',
    color: 'linear-gradient(135deg,#EC4899,#7C3AED)',
    genre: 'Clásica',
    stream: 'https://stream.zeno.fm/your-opus-stream',
  },
  {
    id: 'horizonte',
    name: 'Horizonte',
    freq: '107.9 FM',
    prog: 'Electrónica & EDM',
    abbr: 'HZ',
    color: 'linear-gradient(135deg,#10B981,#3B82F6)',
    genre: 'EDM',
    stream: 'https://stream.zeno.fm/your-horizonte-stream',
  },
  {
    id: 'radio-imer',
    name: 'Radio IMER',
    freq: '94.9 FM',
    prog: 'Variado IMER',
    abbr: 'IM',
    color: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
    genre: 'Variado',
    stream: 'https://stream.zeno.fm/your-imer-stream',
  },
])

const currentStationIndex = ref(0)
const currentStation = computed(() => stations.value[currentStationIndex.value])

function selectStation(station) {
  const idx = stations.value.findIndex(s => s.id === station.id)
  if (idx !== -1) currentStationIndex.value = idx
  nextTick(() => {
    if (audioEl.value) {
      audioEl.value.load()
      audioEl.value.play().catch(err => console.warn('Autoplay bloqueado:', err))
      isPlaying.value = true
    }
  })
}

function togglePlay() {
  if (!audioEl.value) return
  if (isPlaying.value) {
    audioEl.value.pause()
    isPlaying.value = false
  } else {
    audioEl.value.play().catch(err => console.warn('Play bloqueado:', err))
    isPlaying.value = true
  }
}

function prevStation() {
  currentStationIndex.value = (currentStationIndex.value - 1 + stations.value.length) % stations.value.length
  nextTick(() => { if (isPlaying.value) { audioEl.value.load(); audioEl.value.play() } })
}

function nextStation() {
  currentStationIndex.value = (currentStationIndex.value + 1) % stations.value.length
  nextTick(() => { if (isPlaying.value) { audioEl.value.load(); audioEl.value.play() } })
}

function onVolumeChange() {
  if (audioEl.value) audioEl.value.volume = volume.value / 100
}

function onAudioError(e) {
  console.error('Error de audio:', e)
  isPlaying.value = false
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const activeSection = ref('para-ti')
const tabs = [
  { section: 'para-ti',    label: 'Para Ti' },
  { section: 'coleccion',  label: 'Tu Colección' },
  { section: 'estaciones', label: 'Estaciones en Vivo' },
  { section: 'podcasts',   label: 'Podcasts' },
  { section: 'noticias',   label: 'Noticias' },
  { section: 'eventos',    label: 'Eventos' },
  { section: 'concursos',  label: 'Concursos' },
]

// ─── TICKER ───────────────────────────────────────────────────────────────────
const tickerItems = [
  'Banco de México mantiene tasa en 9.5%',
  'Selección Mexicana convocada para eliminatorias',
  'Temperatura récord en Sonora: 48°C',
  'Inauguran nuevo tramo del Tren Maya',
  'Peso mexicano cierra en $17.82 por dólar',
  'Festival Internacional Cervantino anuncia fecha',
]

// ─── NOTICIAS ─────────────────────────────────────────────────────────────────
const categories = [
  { value: 'todo',     label: 'Todo' },
  { value: 'politica', label: 'Política' },
  { value: 'economia', label: 'Economía' },
  { value: 'deportes', label: 'Deportes' },
  { value: 'local',    label: 'Local' },
]

const allNews = [
  { id: 'n1', cat: 'economia',   catLabel: 'Economía',   icon: '📊', time: 'hace 28 min', title: 'Banxico reduce perspectiva de crecimiento del PIB al 1.8%' },
  { id: 'n2', cat: 'deportes',   catLabel: 'Deportes',   icon: '⚽', time: 'hace 45 min', title: "El Tri Sub-23 clasifica a la final del Preolímpico con gol en el 94'" },
  { id: 'n3', cat: 'tecnologia', catLabel: 'Tecnología', icon: '🤖', time: 'hace 1 h',    title: 'México lanzará su primera plataforma nacional de inteligencia artificial' },
  { id: 'n4', cat: 'local',      catLabel: 'Local',      icon: '🏙️', time: 'hace 2 h',    title: 'Morelia refuerza alumbrado público en 12 colonias' },
  { id: 'n5', cat: 'cultura',    catLabel: 'Cultura',    icon: '🎬', time: 'hace 3 h',    title: 'Festival de Cine de Guadalajara anuncia 40 películas mexicanas' },
  { id: 'n6', cat: 'politica',   catLabel: 'Política',   icon: '🏛️', time: 'hace 4 h',    title: 'Senado aprueba reforma a Ley de Telecomunicaciones con 18 enmiendas' },
]

const activeFilter  = ref('todo')
const activeFilter2 = ref('todo')

const filteredNews  = computed(() => activeFilter.value  === 'todo' ? allNews : allNews.filter(n => n.cat === activeFilter.value))
const filteredNews2 = computed(() => activeFilter2.value === 'todo' ? allNews : allNews.filter(n => n.cat === activeFilter2.value))

// ─── TENDENCIAS ───────────────────────────────────────────────────────────────
const trending = [
  { num: 1, title: 'Cumbre Latinoamericana CDMX',  meta: '+8,400 menciones · Política' },
  { num: 2, title: 'Sub-23 Preolímpico final',      meta: '+6,200 menciones · Deportes' },
  { num: 3, title: 'Reforma Telecomunicaciones',    meta: '+3,100 menciones · Política' },
  { num: 4, title: 'Banxico perspectivas PIB',      meta: '+2,800 menciones · Economía' },
  { num: 5, title: 'Festival FICG 2026',            meta: '+1,950 menciones · Cultura' },
]

// ─── FAVORITOS ────────────────────────────────────────────────────────────────
const favRadios = ref([])
const savedNews = ref([])

function isFav(type, id) {
  if (type === 'radio') return favRadios.value.some(r => r.id === id)
  return savedNews.value.some(n => n.id === id)
}

function toggleFav(type, item) {
  if (type === 'radio') {
    const idx = favRadios.value.findIndex(r => r.id === item.id)
    idx === -1 ? favRadios.value.push(item) : favRadios.value.splice(idx, 1)
  }
}

function saveNews(id, title, cat) {
  if (!savedNews.value.find(n => n.id === id)) {
    savedNews.value.push({ id, title, cat })
  }
}

function removeSavedNews(id) {
  savedNews.value = savedNews.value.filter(n => n.id !== id)
}

// ─── RESÚMENES IA ─────────────────────────────────────────────────────────────
const summaries = ref({})

async function toggleSummary(key, title) {
  if (summaries.value[key] && summaries.value[key] !== 'loading') {
    delete summaries.value[key]
    return
  }
  summaries.value[key] = 'loading'
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Eres un asistente de noticias mexicano. Genera un resumen breve (2-3 oraciones) y objetivo de esta noticia: "${title}". Responde solo el resumen, sin introducción.`
        }]
      })
    })
    const data = await res.json()
    summaries.value[key] = data.content?.[0]?.text ?? 'No se pudo generar el resumen.'
  } catch {
    summaries.value[key] = 'Error al conectar con IA.'
  }
}

// ─── CHAT IA ──────────────────────────────────────────────────────────────────
const chatInput    = ref('')
const chatLoading  = ref(false)
const chatMessages = ref(null)
const chatHistory  = ref([{ role: 'ai', text: '¡Hola! 👋 Pregúntame sobre cualquier noticia de hoy.' }])

async function sendChat() {
  const text = chatInput.value.trim()
  if (!text || chatLoading.value) return
  chatHistory.value.push({ role: 'user', text })
  chatInput.value = ''
  chatLoading.value = true

  try {
    const messages = chatHistory.value
      .filter(m => m.role !== 'ai' || chatHistory.value.indexOf(m) > 0)
      .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'Eres el asistente de noticias de OndasMX, una radio y portal de noticias mexicano. Responde en español, de forma concisa y amigable sobre noticias, política, economía, deportes y cultura de México.',
        messages
      })
    })
    const data = await res.json()
    chatHistory.value.push({ role: 'ai', text: data.content?.[0]?.text ?? 'Sin respuesta.' })
  } catch {
    chatHistory.value.push({ role: 'ai', text: 'Error al conectar con el asistente.' })
  } finally {
    chatLoading.value = false
    nextTick(() => {
      if (chatMessages.value) chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    })
  }
}
</script>

<style>
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-logout {
  background-color: #ff4d4d;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background-color 0.2s;
}
.btn-logout:hover {
  background-color: #cc0000;
}

.waveform.paused .wave-bar {
  animation-play-state: paused;
}
.fav-btn.active { color: #EC4899; }

.fav-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: var(--surface, rgba(255,255,255,0.05));
  margin-bottom: 0.5rem;
}
.fav-card-play {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  flex: 1;
  color: inherit;
}
.fav-card-art {
  width: 40px; height: 40px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.8rem; color: white; flex-shrink: 0;
}
.fav-card-name { font-weight: 600; font-size: 0.9rem; }
.fav-card-freq  { font-size: 0.75rem; opacity: 0.6; }
.fav-remove {
  background: none; border: none; cursor: pointer;
  opacity: 0.4; font-size: 0.8rem; color: inherit; transition: opacity 0.2s;
}
.fav-remove:hover { opacity: 1; }
.saved-news-item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.08);
}
.saved-news-title { flex: 1; font-size: 0.85rem; }
.ai-loading { opacity: 0.7; font-style: italic; font-size: 0.85rem; }
.chat-msg--user {
  text-align: right;
  background: var(--accent, #7C3AED);
  border-radius: 12px 12px 4px 12px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  margin-left: auto;
  max-width: 85%;
}
</style>