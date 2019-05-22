<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <span class="cart" @click="showCartList">
          <span class="icon" :class="{active:foodList.length}">
            <i class="icon-shopping_cart"></i>
          </span>
        </span>
        <span class="count" v-show="totalNum>0">{{totalNum}}</span>
        <span class="price">￥{{totalPrice}}</span>
        <span class="delivery-price">另须配送费￥{{deliveryPrice}}元</span>
      </div>
      <div class="content-right">
        <span v-if=" totalPrice === 0 ">￥20元起送</span>
        <span v-else-if=" totalPrice < minPrice ">还差￥{{minPrice - totalPrice}}起送</span>
        <span v-else class="active" @click = "toPay">去结算</span>
      </div>
    </div>
    <transition name="fold">
      <div class="cart-list" v-show="show">
        <div class="cart-content">
          <div class="cart-title">
            <span class="name">购物车</span>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="food-list" ref="listcontent">
            <ul>
              <li
                v-for="(food,index) in foodList"
                :key="index"
                class="food-item"
                v-show="food.count>0"
              >
                <span class="foodname">{{food.name}}</span>
                <span>
                  <span class="foodprice">
                    <span class="icon">￥</span>
                    {{food.price}}
                  </span>
                  <span class="foodcount">{{food.count}}</span>
                </span>
                <cartControl :food="food"></cartControl>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>

    <div class="ball-wrapper">
      <transition-group
        name="drop"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
      >
        <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>

    <transition name="fade">
      <div class="mask" v-show="show" @click="showCartList"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import cartControl from "../cartControl/cartControl.vue";
export default {
  props: {
    deliveryPrice: {
      type: Number,
      default: 4
    },
    minPrice: {
      type: Number,
      default: 20
    },
    foodList: {
      type: Array,
      default() {
        return [
          {
            name: "红烧狮子头",
            price: 0,
            count: 1
          }
        ];
      }
    }
  },
  components: {
    cartControl
  },

  data() {
    return {
      showList: false,
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: []
    };
  },
  computed: {
    totalPrice() {
      let totalPri = 0;
      for (let i = 0; i < this.foodList.length; i++) {
        totalPri += this.foodList[i].price * this.foodList[i].count;
      }
      return totalPri;
    },
    totalNum() {
      let totalNum = 0;
      for (let i = 0; i < this.foodList.length; i++) {
        totalNum += this.foodList[i].count;
      }
      return totalNum;
    },
    show() {
      let flag = this.showList;
      if (flag) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listcontent, { click: true });
          } else {
            this.scroll.refresh();
          }
        });
      }
      if(this.totalNum === 0){
        this.showList = false;
        return false;
      }
      return flag;
    }
  },
  methods: {
    toPay(){
      alert(this.totalPrice)
    },
    showCartList() {
      if (this.totalNum > 0) {
        this.showList = !this.showList;
      }
    },
   empty() {
      this.foodList.forEach((food) => {
        food.count = 0;
      });
      this.showList = false;
    },

    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while (count) {
        count--;
        let ball = this.balls[count];

        if (ball.show) {
          let pos = ball.el.getBoundingClientRect();
          let x = pos.left + 20 + "px";
          let y = -(window.innerHeight - pos.top - 40) + "px";

          el.style.transform = `translate3d(0,${y},0)`;
          let inner = el.querySelector(".inner-hook");
          inner.style.transform = `translate3d(${x},0,0)`;
        }
      }
    },
    enter(el, done) {
      let rf = el.offsetWidth; //在狗子函数里el.offsetWidth去刷新元素的大小，才能实现过渡效果；
      this.$nextTick(() => {
        el.style.transform = `translate3d(0,0,0)`;
        let inner = el.querySelector(".inner-hook");
        inner.style.transform = `translate3d(0,0,0)`;
      });
      setTimeout(function() {
        done();
      }, 400);
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.shopcart {
  z-index: 10;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 48px;
  background-color: #141d27;
  color: rgba(255, 255, 255, 0.4);
  .content {
    position: relative;
    z-index: 999;
    display: flex;
    .content-left {
      background-color: #141d27;
      z-index: 999;
      position: relative;
      flex: 1;
      .cart {
        display: inline-block;
        position: relative;
        top: -10px;
        left: 12px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: #141d27;
        .icon {
          border-radius: 50%;
          display: block;
          margin: 6px;
          width: 44px;
          height: 44px;
          background-color: rgba(255, 255, 255, 0.2);
          text-align: center;
          line-height: 50px;
          color: rgba(255, 255, 255, 0.4);
          .icon-shopping_cart {
            font-size: 24px;
          }
          &.active {
            color: #fff;
            background-color: rgb(0, 160, 220);
          }
        }
      }
      .count {
        width: 24px;
        font-size: 9px;
        font-weight: 700;
        line-height: 16px;
        background-color: rgb(240, 20, 20);
        color: #fff;
        text-align: center;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
        border-radius: 7px;
        position: absolute;
        left: 44px;
        top: -8px;
      }
      .price {
        display: inline-block;
        margin-top: 12px;
        margin-left: 6px;
        padding: 0 12px 0;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        line-height: 24px;
        font-size: 16px;
        vertical-align: top;
      }
      .delivery-price {
        display: inline-block;
        margin-top: 12px;
        padding-left: 12px;
        line-height: 24px;
        font-size: 12px;
        vertical-align: top;
        font-weight: 200;
      }
    }
    .content-right {
      flex: 0 0 105px;
      width: 105px;
      span {
        display: block;
        font-size: 12px;
        text-align: center;
        background-color: #2b333b;
        font-weight: 700;
        line-height: 24px;
        padding: 12px;
        &.active {
          background-color: #00b43c;
          color: #fff;
        }
      }
    }
  }
  .cart-list {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 48px;
    z-index: 9;
    .cart-content {
      position: absolute;
      bottom: 0;
      width: 100%;
      max-height: 260px;
      .cart-title {
        height: 40px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
        line-height: 40px;
        padding: 0 18px;
        background-color: #f3f5f7;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .empty {
          color: rgb(0, 160, 220);
        }
      }
      .food-list {
        max-height: 219px;
        overflow: hidden;
        background-color: #fff;
        padding: 0 18px;
        .food-item {
          display: flex;
          padding: 12px 0;
          justify-content: space-between;
          align-items: stretch;
          height: 48px;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
          box-sizing: border-box;
          .foodname {
            color: rgb(7, 17, 27);
            font-size: 14px;
            line-height: 24px;
          }
          .foodprice {
            color: rgb(240, 20, 20);
            font-size: 14px;
            font-weight: 700;
            line-height: 24px;
            .icon {
              font-size: 10px;
              font-weight: normal;
            }
          }
        }
      }
    }
  }
  .ball-wrapper {
    .ball {
      position: fixed;
      left: 30px;
      bottom: 20px;
      z-index: 999;
      &.drop-enter-active {
        transition: all 0.4s cubic-bezier(0.72, -0.34, 0.25, 1);
      }
      .inner {
        width: 20px;
        height: 20px;
        background-color: blue;
        border-radius: 50%;
        transition: all 0.4s;
      }
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(7, 17, 27, 0.6);
    z-index: -1;
    filter: blur(10px);
  }
}
.fold-enter-active,
.fold-leave-active {
  transition: all 0.5s;
}
.fold-enter, .fold-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(260px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>