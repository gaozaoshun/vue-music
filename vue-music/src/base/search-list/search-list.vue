<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" v-for="item in searches" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        refreshDelay: 120
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display flex
      align-items center
      height 30px
      overflow hidden
      font-size $font-size-small
      &.list-enter-active,&.list-leave-active
        transition all .2s
      &.list-enter,&.list-leave-to
        height 0
      .text
        flex 1
        color $color-text-l
      .icon
        extend-click()
        .icon-delete
          color $color-text-d
</style>
