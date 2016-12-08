<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectedType===2}">{{ desc.all }}<span class="count">{{ ratings.length }}</span></span>
      <span @click="select(0,$event)"  class="block positive"  :class="{'active':selectedType===0}">{{ desc.positive }}<span class="count">{{ positives.length }}</span></span>
      <span @click="select(1,$event)"  class="block negative"  :class="{'active':selectedType===1}">{{ desc.negative }}<span class="count">{{ negatives.length }}</span></span>
    </div>
    <div @click="toggleContent(selectedOnlyContent,$event)" class="switch" :class="{'on':selectedOnlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script text="text/ecmascript-6">
  import EventHub from '../../common/js/eventHub.js';
  /* eslint-disable no-unused-vars */
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    data () {
      return {
        /*************************************
        **VUE2.0中反向回传是WARN级别的提示      **
        **为了不直接修改父组件传递来的props参数的值**
        **可以使用data或computed定义临时变量通信 **
        *************************************/
        selectedOnlyContent: this.onlyContent
      };
    },
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedType = type;
        // 通知父组件selectType的值的变更
        EventHub.$emit('ratingtype.select', type);
      },
      toggleContent(onlyContent, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedOnlyContent = !onlyContent;
        // 通知父组件selectType的值的变更
        EventHub.$emit('content.toggle', this.selectedOnlyContent);
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      },
      /*************************************
      **VUE2.0中反向回传是WARN级别的提示      **
      **为了不直接修改父组件传递来的props参数的值**
      **可以使用data或computed定义临时变量通信 **
      *************************************/
      selectedType() {
        return this.selectType;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      font-size: 0
      border-1px(rgba(7, 17, 27, .1))
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          font-size: 8px
          margin-left: 2px
        &.positive
          background: rgba(0, 160, 220, .2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, .2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding:12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, .1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px

</style>
