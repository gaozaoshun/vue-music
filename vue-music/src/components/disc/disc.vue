<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getSongList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'

  export default {
    computed: {
      title () {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    created () {
      this._getSongList()
    },
    data () {
      return {
        songs: []
      }
    },
    components: {MusicList},
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.back()
        }
        getSongList(this.disc.dissid).then(res => {
          if (ERR_OK === res.code) {
            this.songs = this._normalizeList(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeList (list) {
        let ret = []
        list.forEach((item) => {
          if (item.songid && item.albumid) {
            ret.push(createSong(item))
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
