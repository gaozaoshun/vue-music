<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDiscPlayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果！"></no-result>
    </div>
  </scroll>
</template>

<script>
  import { search } from 'api/search'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import { mapMutations, mapActions } from 'vuex'
  import NoResult from 'base/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const PERPAGE = 20

  export default {
    components: {Scroll, Loading, NoResult},
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true,
        beforeScroll: true
      }
    },
    watch: {
      query () {
        this._search()
      }
    },
    methods: {
      _search () {
        this.hasMore = true
        search(this.query, this.page, this.showSinger, PERPAGE).then(res => {
          if (ERR_OK === res.code) {
            this.result = this._getResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, PERPAGE).then(res => {
          if (ERR_OK === res.code) {
            this.result = this.result.concat(this._getResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      selectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      listScroll () {
        this.$emit('listScroll')
      },
      _checkMore(data) {
        let song = data.song
        if (!song.list.length || !((song.curnum + (song.curpage - 1) * PERPAGE) < song.totalnum)) {
          this.hasMore = false
        }
      },
      _getResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      getIconClass(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        }
        return 'icon-music'
      },
      getDiscPlayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        }
        return `${item.name}-${item.singer}`
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          if (item.songid && item.albumid) {
            ret.push(createSong(item))
          }
        })
        return ret
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height 100%
    overflow hidden
    .suggest-list
      padding 0 30px
      .suggest-item
        display flex
        align-items center
        padding-bottom 20px
        .icon
          flex 0 0 30px
          width 30px
          [class^="icon-"]
            font-size 14px
            color $color-text-d
        .name
          flex 1
          font-size $font-size-medium
          color $color-text-d
          overflow hidden
          .text
            no-wrap()

    .no-result-wrapper
      position absolute
      top 50%
      width 100%
      transform translateY(-50%)
</style>
