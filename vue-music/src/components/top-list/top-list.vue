<template>
  <transition name="slide">
    <music-list :songs="songList" :title="title" :bgImage="bgImage" :rank="rank">
    </music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getSongList } from 'api/rank'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'

  export default {
    components: {MusicList},
    computed: {
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songList.length) {
          return this.songList[0].image
        }
      },
      ...mapGetters([
        'topList'
      ])
    },
    created () {
      this._getSongList()
    },
    data () {
      return {
        songList: [],
        rank: true
      }
    },
    methods: {
      _getSongList () {
        if (!this.topList.id) {
          this.$router.push('/rank')
        }
        getSongList(this.topList.id).then(res => {
          if (ERR_OK === res.code) {
            console.log(res.songlist)
            this.songList = this._normalizeList(res.songlist)
          }
        })
      },
      _normalizeList (list) {
        let ret = []
        list.forEach(item => {
          const musicData = item.data
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
