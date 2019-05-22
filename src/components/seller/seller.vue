<template>
  <div class="seller" ref="seller">
    <div class="seller-wrapper">
      <div class="overview">    
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <span class="star">
            <star :size="36" :score="seller.score"></star>
          </span>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>元
            </div>
          </li>
        </ul>  
      </div>
      <split></split>
      <div class="bulletin">
        <h2 class="title">公告与活动</h2>
        <div class="content-wrapper">
          <div class="content">{{seller.bulletin}}</div>
        </div>
        <ul class="supports">
          <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
            <div class="icon" :class="classMap[item.type]"></div>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
          <div class="title">商家实景</div>
          <div class="pic-wrapper" ref = "picwrapper">
              <ul class="pic-list"  ref = "piclist">
                  <li class="pic-item" v-for="(item,index) in seller.pics" :key="index" >
                      <img :src="item" alt="">
                  </li>
              </ul>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import star from "../star/star.vue";
import split from "../split/split.vue";
import {saveLocal} from "../../common/js/store.js"
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
      favorite:false,

    };
  },
  computed:{
    favoriteText(){
      return this.favorite ? "已收藏" : "未收藏";
    }
  },
  components: {
    star,
    split
  },
  created() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.seller, { cilck: true });
      let width = 120;
      let marginRight = 6;
      let totalWidth =  this.$refs.piclist.children.length*(width+marginRight)-marginRight;
      
      this.$refs.piclist.style.width =totalWidth+"px";
      console.log(this.$refs.piclist.style.width)
      this.picScroll = new BScroll(this.$refs.picwrapper, { cilck: true,ScrollX:true,eventPassthrough:"vertical"});
    });
    
  },methods:{
    bian(){
      this.favorite = !this.favorite
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/css/mixins.scss";
.seller {
  position: absolute;
  top: 186px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;

  .overview {
    position: relative;
    padding: 18px;

    .title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .desc {
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      font-size: 0;

      .star {
        display: inline-block;
        margin-right: 8px;
        vertical-align: top;
      }

      .text {
        display: inline-block;
        margin-right: 12px;
        line-height: 18px;
        vertical-align: top;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }

    .remark {
      display: flex;
      padding-top: 18px;

      .block {
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27, 0.1);

        &:last-child {
          border: none;
        }

        h2 {
          margin-bottom: 4px;
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .content {
          line-height: 24px;
          font-size: 10px;
          color: rgb(7, 17, 27);

          .stress {
            font-size: 24px;
          }
        }
      }
    }

    .favorite {
      position: absolute;
      width: 50px;
      right: 11px;
      top: 176px;
      text-align: center;

      .icon-favorite {
        display: block;
        margin-bottom: 4px;
        line-height: 24px;
        font-size: 24px;
        color: #d4d6d9;

        &.active {
          color: rgb(240, 20, 20);
        }
      }

      .text {
        line-height: 10px;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }
  }

  .bulletin {
    padding: 18px 18px 0 18px;

    .title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .content-wrapper {
      padding: 0 12px 16px 12px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .content {
        line-height: 24px;
        font-size: 12px;
        color: rgb(240, 20, 20);
      }
    }

    .supports {
      .support-item {
        padding: 16px 12px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        font-size: 0;

        &:last-child {
            border: none;
        }
      }

      .icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        vertical-align: top;
        margin-right: 6px;
        background-size: 16px 16px;
        background-repeat: no-repeat;

        &.decrease {
          @include bgimg("images/decrease_4");
        }

        &.discount {
          @include bgimg("images/discount_4");
        }

        &.guarantee {
          @include bgimg("images/guarantee_4");
        }

        &.invoice {
          @include bgimg("images/invoice_4");
        }

        &.special {
          @include bgimg("images/special_4");
        }
      }

      .text {
        line-height: 16px;
        font-size: 12px;
        color: rgb(7, 17, 27);
      }
    }
  }

  .pics {
    padding: 18px;

    .title {
      margin-bottom: 12px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .pic-wrapper {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;

      .pic-list {
        font-size: 0;
        
        .pic-item {
          display: inline-block;
          margin-right: 6px;
          width: 120px;
          height: 90px;
            img{
                width: 100%;
                height: 100%;
            }
          &:last-child {
            margin: 0;
          }
        }
      }
    }
  }

  .info {
    padding: 18px 18px 0 18px;
    color: rgb(7, 17, 27);

    .title {
      padding-bottom: 12px;
      line-height: 14px;
      font-size: 14px;
    }

    .info-item {
      padding: 16px 12px;
      line-height: 16px;

      font-size: 12px;

      &:last-child {
      }
    }
  }
}
</style>