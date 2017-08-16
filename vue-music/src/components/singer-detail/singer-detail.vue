<template>
  <transition name="fade">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    components: {MusicList},
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail () {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            let songs = this._normalizeSongs(res.data.list)
            this.songs = songs
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"


  .fade-enter-active, .fade-leave-active
    transition all .3s linear

  .fade-enter, fade-leave-to
    transform translate3d(100%, 0, 0)
</style>
