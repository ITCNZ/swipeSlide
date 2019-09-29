import * as React from 'react';
import PropTypes from 'prop-types';
import bem from '../_utils/bem';

const nbem = bem('swipe');

export interface SwipeProps {
  autoPlay?: boolean; // 是否自滚动
  initIndex?: number; // 默认起始索引
  showIndicators?: boolean; // 是否显示指示器
  indicatorColor?: string; // 指示器颜色
  indicatorType?: string; // 指示器形式，dot圆点、number数字两种类型
  autoPlayDelay?: number; // 滚动间隔时间，单位ms
  imgsArr?: Array<any>; // 轮播数据
  autoDir?: string; // 滚动方向，row横向，column纵向
  swipeW?: number | string; // 轮播宽度
  swipeH?: number | string; // 轮播高度
}

export default class Swipe extends React.Component<SwipeProps, any> {

  static propTypes = {
    autoPlay: PropTypes.bool,
    initIndex: PropTypes.number,
    showIndicators: PropTypes.bool,
    indicatorColor: PropTypes.string,
    indicatorType: PropTypes.string,
    autoPlayDelay: PropTypes.number,
    imgsArr: PropTypes.array,
    autoDir: PropTypes.string,
    swipeW: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    swipeH: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    autoPlay: true,
    initIndex: 0,
    showIndicators: true,
    indicatorColor: '#ffffff',
    indicatorType: 'dot',
    autoDir: 'row',
    imgsArr: [],
    autoPlayDelay: 3000,
    swipeW: '100%',
    swipeH: 200
  };

  constructor(props: any) {
    super(props);
    this.state = {
      activeIndex: props.initIndex, // 当前索引
      itemImgsArr: props.imgsArr, // 数据列表
      transX: 0, // 滑动距离
      duration: 350, // 动画时长
      touch: {
        s: [],
        d: ''
      },
      isTransToX: false // 是否开启滑动动画
    };
  }

  componentDidMount() {
    this.setState(
      {
        clientW: this.swipeDom.current!.clientWidth,
        clientH: this.swipeDom.current!.clientHeight
      },
      () => {
        let { imgsArr = [], autoPlay, autoDir } = this.props;
        let { activeIndex, clientW, clientH } = this.state;
        let itemImgsArr =
          imgsArr.length > 1 ? imgsArr.slice(-1).concat(imgsArr, imgsArr.slice(0, 1)) : imgsArr;

        if (itemImgsArr.length > 1) {
          activeIndex = activeIndex + 1;
          let transX = -(autoDir === 'column' ? clientH : clientW) * activeIndex;
          this.setState({ activeIndex, transX });
        }
        clearInterval(this.autoPlayTimer);
        if (autoPlay) {
          this.autoPlayFn();
        }
        this.setState({ itemImgsArr });
      }
    );
  }

  componentWillUnmount() {
    clearInterval(this.autoPlayTimer);
  }

  // 定时函数
  autoPlayFn() {
    const { autoPlay, autoPlayDelay } = this.props;
    clearInterval(this.autoPlayTimer);
    if (autoPlay === false) return;
    this.autoPlayTimer = setInterval(() => {
      this.autoFn('left');
    }, autoPlayDelay);
  }

  // 忽略滑动
  ignoreTouch() {
    return this.state.itemImgsArr.length <= 1;
  }

  // 创建dots点
  private renderIndicators() {
    const { autoDir, indicatorColor, indicatorType, imgsArr = [], showIndicators } = this.props;
    if (!showIndicators) return;
    let { activeIndex } = this.state;
    return (
      <div className={nbem('indicators' + (autoDir === 'column' ? ' indicators-column' : ''))}>
        {indicatorType === 'dot' ? (
          imgsArr.map((item: object, i: number) => {
            return (
              <span
                className={'dots' + (activeIndex === i + 1 ? ' active' : '')}
                key={i}
                style={{ backgroundColor: indicatorColor }}
              />
            );
          })
        ) : (
          <span className={'dots-number'} style={{ color: indicatorColor }}>
            {activeIndex}/{imgsArr.length}
          </span>
        )}
      </div>
    );
  }

  // 创建item内容
  private renderItem() {
    const { itemImgsArr = [] } = this.state;
    return itemImgsArr.map((item: any, i: number) => {
      return (
        <div className={nbem(['item'])} key={i}>
          <img src={item.url} alt={item.title} />
        </div>
      );
    });
  }

  onTouchStart = (e: React.TouchEvent) => {
    if (this.ignoreTouch()) return;
    clearInterval(this.autoPlayTimer);
    this.setState({
      touch: {
        ...this.state.touch,
        s: [e.targetTouches[0].pageX, e.targetTouches[0].pageY, new Date().getTime()]
      }
    });
  };

  onTouchMove = (e: React.TouchEvent) => {
    const { touch, clientW, clientH } = this.state;
    const { autoDir } = this.props;

    if (
      Math.abs(e.targetTouches[0].pageX - touch.s[0]) >=
        Math.abs(e.targetTouches[0].pageY - touch.s[1]) &&
      touch.d === ''
    ) {
      this.setState({
        // 左右
        touch: { ...touch, d: 1 }
      });
    } else if (touch.d === '') {
      // 上下或者偏上下
      this.setState({
        touch: { ...touch, d: 0 }
      });
    }

    if (touch.d === 1 && autoDir === 'row') {
      console.log('左右');
      // 左右滚动
      e.preventDefault();
      this.setState({
        transX: -this.state.activeIndex * clientW + e.targetTouches[0].pageX - touch.s[0]
      });
    }
    if (touch.d === 0 && autoDir === 'column') {
      console.log('上下');
      // 上下滚动
      e.preventDefault();
      this.setState({
        transX: -this.state.activeIndex * clientH + e.targetTouches[0].pageY - touch.s[1]
      });
    }
  };

  onTouchEnd = (e: React.TouchEvent) => {
    const { touch, clientW, clientH } = this.state;
    const { autoDir } = this.props;

    if (new Date().getTime() - touch.s[2] > 700) {
      if (touch.d === 1 && autoDir === 'row') {
        if (e.changedTouches[0].pageX - touch.s[0] > clientW / 3) {
          this.autoFn('right');
        } else if (touch.s[0] - e.changedTouches[0].pageX > clientW / 3) {
          this.autoFn('left');
        } else {
          this.autoFn('reset');
        }
      }
      if (touch.d === 0 && autoDir === 'column') {
        if (e.changedTouches[0].pageY - touch.s[1] > clientH / 3) {
          this.autoFn('right');
        } else if (touch.s[1] - e.changedTouches[0].pageY > clientH / 3) {
          this.autoFn('left');
        } else {
          this.autoFn('reset');
        }
      }
    } else {
      if (touch.d === 1 && autoDir === 'row') {
        if (e.changedTouches[0].pageX > touch.s[0]) {
          this.autoFn('right');
        } else if (touch.s[0] > e.changedTouches[0].pageX) {
          this.autoFn('left');
        }
      }
      if (touch.d === 0 && autoDir === 'column') {
        if (e.changedTouches[0].pageY > touch.s[1]) {
          this.autoFn('right');
        } else if (touch.s[1] > e.changedTouches[0].pageY) {
          this.autoFn('left');
        }
      }
    }
    this.setState({
      touch: { ...touch, d: '' }
    });
  };

  // 滑动函数
  autoFn(dir: string) {
    let { clientW, clientH, activeIndex, itemImgsArr = [] } = this.state;
    const { autoDir } = this.props;
    let clientRange = autoDir === 'column' ? clientH : clientW;
    if (dir === 'left') {
      activeIndex++;
      this.setState(
        {
          activeIndex,
          transX: -activeIndex * clientRange,
          isTransToX: true
        },
        () => {
          if (activeIndex === itemImgsArr.length - 1) {
            activeIndex = 1;
            this.setState({
              activeIndex
            });
            setTimeout(() => {
              this.setState({
                transX: -activeIndex * clientRange,
                isTransToX: false
              });
            }, this.state.duration + 50); // 此处加50为了解决滑动后产生闪屏现象
          }
        }
      );
    } else if (dir === 'right') {
      activeIndex--;
      this.setState(
        {
          activeIndex,
          transX: -activeIndex * clientRange,
          isTransToX: true
        },
        () => {
          if (activeIndex === 0) {
            activeIndex = itemImgsArr.length - 2;
            this.setState({
              activeIndex
            });
            setTimeout(() => {
              this.setState({
                transX: -activeIndex * clientRange,
                isTransToX: false
              });
            }, this.state.duration + 50);
          }
        }
      );
    } else if (dir === 'reset') {
      this.setState({
        transX: -activeIndex * clientRange,
        isTransToX: true
      });
    }
    if (this.props.autoPlay) {
      this.autoPlayFn();
    }
  }

  transitionendFn = (e: React.TransitionEvent) => {
    if ((e.target as HTMLInputElement).className === 'swipe-content') {
      if (this.state.isTransToX) {
        this.setState({
          isTransToX: false
        });
      }
    }
  };

  private swipeDom = React.createRef<HTMLDivElement>(); // 获取当前dom
  private autoPlayTimer: any = null; // 设置定时器

  render() {
    const { transX, duration, isTransToX } = this.state;
    const { autoDir, swipeW, swipeH } = this.props;

    return (
      <div
        className={nbem([autoDir === 'column' ? 'column' : ''])}
        style={{ width: swipeW, height: swipeH }}
        ref={this.swipeDom}
      >
        <div
          className="swipe-content"
          style={{
            transform:
              autoDir === 'column'
                ? `translate3d(0, ${transX}px, 0)`
                : `translate3d(${transX}px, 0, 0)`,
            transition: isTransToX ? `transform ${duration}ms cubic-bezier(0,0,0.25,1)` : ''
          }}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          onTransitionEnd={this.transitionendFn}
        >
          {this.renderItem()}
        </div>
        {this.renderIndicators()}
      </div>
    );
  }
}
