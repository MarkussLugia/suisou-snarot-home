import { Title } from "@solidjs/meta";
import { createMemo, createSignal, Element, For, Loading, Show, SourceAccessor } from "solid-js";
import snarot_logo_laser from "/src/routes/snarot_logo_laser.webp";

/** 单张卡牌数据定义 */
export interface SlugCard {
  /** 卡牌的名称。 */
  name: string;

  /** <可选> 卡牌的描述文本。 */
  desc?: string;

  /** 卡牌的画师。 */
  illust: string;

  /**
   * 指向卡牌高清图片的相对路径。
   * @example "/preset/star.png"
   */
  img: string;

  /**
   * 指向卡牌网页缩略图的相对路径。
   * @example "/member/crealine.webp"
   */
  thu: string;

  /** 卡牌的数字。0 代表当前卡牌没有数字。 */
  number: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  /** 能够匹配的场地颜色。"u"代表此卡牌出牌不受颜色限制。 */
  applyColor: "r" | "g" | "b" | "y" | "u";

  /** 此卡牌更新的场地颜色。"s"代表由出牌者指定更新的颜色，"n"代表此卡牌不更新颜色。 */
  updateColor: "r" | "g" | "b" | "y" | "s" | "n";

  /** 打出后，将此卡牌加入巨塔。 */
  addToTower: boolean;

  /** 打出后，反转出牌顺序。 */
  reverse: boolean;

  /** 打出后，清除自身未生效的抽卡预言。 */
  clearAttack: boolean;

  /** 打出后，下一位玩家的出牌将被跳过一次。 */
  disable: boolean;

  /** 打出后，对下一位玩家附加抽卡预言。0 代表不启用。 */
  attackDraw: number;

  /** 对下一位玩家附加抽卡预言的延迟回合。0 代表立即生效。 */
  attackDelay: number;

  /** 打出后，对当前玩家进行抽卡惩罚。 */
  selfDraw: number;

  /** 打出后，开始巨塔崩塌环节。 */
  collapse: boolean;
}

export interface SlugCardJSON {
  list: SlugCard[];
}

const cardBaseURL = new URL("/cards/", origin);

class CardJSONLoader {
  loadURL: string;
  data: SlugCardJSON | undefined;
  constructor(url: string) {
    this.loadURL = url;
  }
  async getData(): Promise<SlugCardJSON> {
    if (this.data != undefined) {
      return this.data;
    } else {
      return await this.fetchData();
    }
  }
  async fetchData(): Promise<SlugCardJSON> {
    const response = await fetch(new URL(this.loadURL, cardBaseURL));
    const dataJson: SlugCardJSON = await response.json();
    this.data = dataJson;
    return dataJson;
  }
}

const slugCardBasic = new CardJSONLoader("./cards_basic.json");
const slugCardNPC = new CardJSONLoader("./cards_npc.json");
const slugCardPlayer = new CardJSONLoader("./cards_player.json");

const placeholderCard: SlugCard = {
  name: "",
  illust: "",
  img: "",
  thu: "",
  number: 0,
  applyColor: "u",
  updateColor: "n",
  addToTower: false,
  reverse: false,
  clearAttack: false,
  disable: false,
  attackDraw: 0,
  attackDelay: 0,
  selfDraw: 0,
  collapse: false,
};

export default function Cards() {
  const cardBasicData = createMemo(() => slugCardBasic.getData());
  const cardNPCData = createMemo(() => slugCardNPC.getData());
  const cardPlayerData = createMemo(() => slugCardPlayer.getData());
  const sections: { data: SourceAccessor<SlugCardJSON>; title: string }[] = [
    {
      title: "基本卡牌",
      data: cardBasicData,
    },
    {
      title: "NPC",
      data: cardNPCData,
    },
    {
      title: "玩家",
      data: cardPlayerData,
    },
  ];

  const [showDetail, setShowDetail] = createSignal<boolean>(false);
  const [detailCard, setDetailCard] = createSignal<SlugCard>(placeholderCard);
  return (
    <div class="w-screen h-screen overflow-y-scroll">
      <SlugCardDetail
        data={detailCard()}
        onClose={() => setShowDetail(false)}
        show={showDetail()}
      ></SlugCardDetail>
      <main class="text-sky-200 font-usmcc-serif flex flex-col justify-center items-center z-0 pt-24">
        <Title>牌库 - 塔螺牌</Title>

        <div class="text-left w-full sm:w-xl lg:w-252 px-4 sm:px-2 lg:px-0">
          <div class="text-7xl lg:text-9xl text-sky-300 pt-8 sm:pt-20 lg:pt-24">
            塔螺牌
            <span class="text-4xl sm:text-7xl lg:text-9xl"> 牌库</span>
          </div>
          <div class="text-3xl lg:text-2xl text-sky-500 pl-0 sm:pl-0.5 pt-12 lg:pt-8">
            在丰盛的晚宴与舞会后、宝可梦们来到一个放映厅，你们从未见过这般美丽扭曲的外在。
            <br class="hidden lg:inline" />
            海中的贵人们用触手捧着红色的、像是好啦鱿的活体机器……
          </div>
          <div class="text-4xl lg:text-4xl text-sky-500 pl-0 sm:pl-0.5 pb-8 pt-8 lg:pb-16 lg:pt-0">
            海水斑驳光线的交错中，
            <span class="text-sky-100">你们灵魂的形状变成卡片。</span>
          </div>
        </div>
        <For each={sections}>
          {(item) => (
            <div class="box-border w-full sm:w-xl lg:w-252">
              <Loading fallback={<div class="text-sky-300 opacity-50 my-32">加载中</div>}>
                <SlugCardGrid
                  onViewCard={(card) => {
                    setDetailCard(card);
                    setShowDetail(true);
                  }}
                  data={item.data()}
                  title={item.title}
                  viewing={showDetail() ? detailCard() : null}
                />
              </Loading>
            </div>
          )}
        </For>
      </main>
    </div>
  );
}

function SlugCardGrid(props: {
  data: SlugCardJSON;
  title: string;
  onViewCard: (card: SlugCard) => void;
  viewing: SlugCard | null;
}) {
  return (
    <div class="text-left w-full box-border px-2 sm:px-0">
      <h2 class="text-5xl px-2 sm:px-1 py-6 text-left w-full inline-block">{props.title}</h2>
      <For each={props.data.list}>
        {(card) => (
          <SlugCardThumb
            onClick={() => props.onViewCard(card)}
            src={cardBaseURL + card.thu}
            showing={props.viewing == card}
          />
        )}
      </For>
    </div>
  );
}

function SlugCardThumb(props: { src: string; onClick: () => void; showing: boolean }) {
  let [loaded, setLoaded] = createSignal(false);
  let [rotate, _setRotate] = createSignal(Math.random() * 4 - 2);
  return (
    <div
      class={[
        "aspect-360/618 w-[calc(25%-0.5rem)] mx-1 my-0.5 sm:w-32 sm:mx-2 sm:my-2.5 overflow-hidden rounded-sm bg-[#c7c8b6] inline-block text-[0px] transition-[scale,rotate,opacity] duration-500 ease-out origin-center cursor-pointer",
        {
          "scale-110 opacity-50": props.showing,
          "scale-100 opacity-100": !props.showing,
        },
      ]}
      style={{ rotate: loaded() ? `${rotate()}deg` : "0deg" }}
      onClick={() => props.onClick()}
    >
      <img
        class={[
          "w-full transition-opacity duration-300",
          { "opacity-100": loaded(), "opacity-0": !loaded() },
        ]}
        src={props.src}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      ></img>
    </div>
  );
}

const colorTextMap = {
  r: "红色",
  g: "绿色",
  b: "蓝色",
  y: "黄色",
  u: "",
  s: "",
  n: "",
};

function SlugCardDetail(props: { data: SlugCard; onClose: () => void; show: boolean }) {
  return (
    <>
      <div
        id="card-detail-bg"
        class={[
          "fixed w-screen h-screen left-0 top-0 overflow-y-scroll sm:overflow-y-hidden sm:flex sm:flex-col justify-center items-center backdrop-blur-2xl backdrop-brightness-80 z-80 sm:z-40 transition-opacity duration-200 overscroll-none",
          {
            "opacity-100 pointer-events-auto": props.show,
            "opacity-0 pointer-events-none": !props.show,
          },
        ]}
      >
        <div
          class={[
            "w-full lg:w-252 sm:px-4 lg:px-0 justify-center items-center flex flex-col sm:flex-row flex-nowrap relative",
          ]}
        >
          <SlugCardView data={props.data} show={props.show} />
          <div class="font-usmcc-serif text-sky-200 w-full sm:w-auto sm:grow sm:max-h-[80vh] sm:overflow-y-scroll text-left pt-0 sm:pt-4 lg:pt-8 pb-4 sm:pb-0 px-8 sm:px-2">
            <div>
              <p class="text-4xl sm:text-5xl sm:pb-2">{props.data.name}</p>
              <p class="text-xl font-sans text-sky-300 italic font-bold tracking-wider">
                illust. {props.data.illust}
              </p>
            </div>
            <div class="w-full mt-3 pb-20 text-xl">
              <Show when={props.data.desc}>
                <p class="mt-4">{props.data.desc}</p>
              </Show>
              <Show
                when={
                  props.data.applyColor != "u" && props.data.updateColor === props.data.applyColor
                }
              >
                <DetailEffect
                  title={
                    (props.data.number != 0 ? `数字 ${props.data.number}，` : "") +
                    colorTextMap[props.data.applyColor]
                  }
                >
                  <span>
                    {props.data.clearAttack && "除可反制的情况外，"}此卡牌只能在场地
                    {props.data.number != 0 && `数字为 ${props.data.number} 或`}颜色为
                    {colorTextMap[props.data.applyColor]}时打出。
                    {props.data.number != 0 && (
                      <span>
                        <br />
                        打出后，场地数字和颜色更新为 {props.data.number} 和
                        {colorTextMap[props.data.updateColor]}。
                      </span>
                    )}
                  </span>
                </DetailEffect>
              </Show>
              <Show
                when={
                  props.data.updateColor != "s" &&
                  props.data.updateColor != "n" &&
                  props.data.applyColor === "u"
                }
              >
                <DetailEffect title={"转色（" + colorTextMap[props.data.updateColor] + "）"}>
                  <span>打出后，场地颜色更新为{colorTextMap[props.data.updateColor]}。</span>
                </DetailEffect>
              </Show>
              <Show
                when={
                  props.data.updateColor === "s" &&
                  props.data.applyColor === "u" &&
                  props.data.number === 0
                }
              >
                <DetailEffect title="选色">
                  <span>打出后，场地颜色更新为玩家指定的颜色。</span>
                </DetailEffect>
              </Show>
              <Show when={props.data.attackDraw > 0}>
                <DetailEffect
                  title={
                    "抽卡预言（" +
                    `+${props.data.attackDraw}` +
                    `${props.data.attackDelay > 0 ? "，延迟 " + props.data.attackDelay : ""}` +
                    `${props.data.selfDraw > 0 ? "，Self+" + props.data.selfDraw : ""}` +
                    "）"
                  }
                >
                  {props.data.attackDelay === 0 ? (
                    <span>打出后，下一位玩家立即抽取 {props.data.attackDraw} 张牌。</span>
                  ) : (
                    <span>
                      打出后，下一位玩家被附加 +{props.data.attackDraw} 抽卡预言，
                      {props.data.attackDelay} 回合后生效。
                    </span>
                  )}
                  {props.data.selfDraw > 0 && (
                    <span>
                      <br />
                      打出时，自己也要抽 {props.data.selfDraw} 张牌。
                    </span>
                  )}
                </DetailEffect>
              </Show>
              <Show when={props.data.clearAttack}>
                <DetailEffect title="反制">
                  <span>
                    打出后，清除自身被附加的抽卡预言。在巨塔崩塌时打出，可以免除自己本回合的崩塌抽卡。
                  </span>
                  {props.data.applyColor != "u" && (
                    <span>
                      <br />
                      自身被附加抽卡预言，或巨塔正在崩塌时，此卡牌可以无视场地颜色打出。
                    </span>
                  )}
                </DetailEffect>
              </Show>
              <Show when={props.data.reverse}>
                <DetailEffect title="反转">
                  <span>打出后，反转接下来的出牌顺序。</span>
                </DetailEffect>
              </Show>
              <Show when={props.data.disable}>
                <DetailEffect title="禁止">
                  <span>
                    打出后，{props.data.reverse && "以反转后的新顺序，"}下一位玩家的回合被跳过一次。
                  </span>
                </DetailEffect>
              </Show>
              <Show when={props.data.collapse}>
                <DetailEffect title="塔">
                  <span>打出后，巨塔开始崩塌。</span>
                </DetailEffect>
              </Show>
              <Show when={props.data.addToTower}>
                <DetailEffect title="化塔">
                  <span>打出后，此卡牌被移动到高塔牌堆，而不是弃牌堆。</span>
                </DetailEffect>
              </Show>
            </div>
          </div>
          <div class="hidden sm:block absolute pr-6 lg:pr-2 pb-2 lg:pb-4 bottom-0 right-0">
            <div
              class="cursor-pointer font-usmcc-serif text-2xl tracking-wider pl-4 pr-2 pb-2 pt-2 border-transparent border-b-sky-300 text-sky-300 hover:border-b-sky-200 hover:text-sky-200 transition-colors border-solid border-b-6 border-l rounded-bl-[2.4rem] rounded-br-sm rounded-tl-4xl select-none"
              onClick={() => props.onClose()}
            >
              返回
            </div>
          </div>
        </div>
      </div>
      <div
        id="return-button-mobile"
        class={[
          "block sm:hidden fixed bottom-0 right-0 z-90 pl-12 pr-8 py-6 transition-opacity bg-radial",
          {
            "opacity-100 pointer-events-auto": props.show,
            "opacity-0 pointer-events-none": !props.show,
          },
        ]}
      >
        <div
          class="cursor-pointer font-usmcc-serif text-2xl tracking-wider pl-4 pr-2 pb-2 pt-2 border-transparent border-b-sky-300 text-sky-300 hover:border-b-sky-200 hover:text-sky-200 transition-colors border-solid border-b-6 border-l rounded-bl-[2.4rem] rounded-br-sm rounded-tl-4xl select-none"
          onClick={() => props.onClose()}
        >
          返回
        </div>
      </div>
    </>
  );
}

function DetailEffect(props: { children: Element | Element[]; title: string }) {
  return (
    <p class="mt-4">
      <span class="text-2xl text-sky-100">{props.title}</span>
      <br />
      {props.children}
    </p>
  );
}

const MAX_TILT_ANGLE = 15;

function toTiltAngle(angle: number) {
  const clamped = Math.min(MAX_TILT_ANGLE, Math.max(-MAX_TILT_ANGLE, -angle));
  return Math.round(clamped * 100) / 100;
}

function SlugCardView(props: { data: SlugCard; show: boolean }) {
  const cardThumb = createMemo(() => `url(${cardBaseURL + props.data.thu})`);
  const cardImageEl = createMemo(() => {
    const img_url = cardBaseURL + props.data.img;
    return <img class="h-full absolute left-0 top-0" src={img_url}></img>;
  });

  const [pointer, setPointer] = createSignal({ x: 0, y: 0 });
  const [hueShift, setHueShift] = createSignal(0);
  const [distance, setDistance] = createSignal(0);
  const [tiltRefHeight, setTiltRefHeight] = createSignal(0);
  let tiltAreaEl: HTMLDivElement | undefined;

  const handleTouch = (event: TouchEvent) => {
    event.stopPropagation();
    handlePointerMove(event.touches[0]);
  };
  const handlePointerMove = (event: MouseEvent | Touch) => {
    if (!tiltAreaEl) return;
    const rect = tiltAreaEl.getBoundingClientRect();
    setTiltRefHeight(rect.height);
    const x = Math.max(
      -rect.height / 2,
      Math.min(rect.height / 2, event.clientX - rect.left - rect.width / 2),
    );
    const y = Math.max(
      -rect.height / 2,
      Math.min(rect.height / 2, event.clientY - rect.top - rect.height / 2),
    );
    setPointer({ x, y });
    setHueShift((x * x + y * y) / 100);
    setDistance(Math.sqrt((x * x + y * y) / 100));
  };

  const resetPointer = () => {
    setPointer({ x: 0, y: 0 });
    setHueShift(0);
    setDistance(0);
  };

  const tiltTransform = createMemo(() => {
    let rotateX = 0;
    let rotateY = 0;
    const halfHeight = tiltRefHeight() / 2;
    if (halfHeight > 0) {
      rotateX = toTiltAngle((pointer().y / halfHeight) * MAX_TILT_ANGLE);
      rotateY = toTiltAngle((-pointer().x / halfHeight) * MAX_TILT_ANGLE);
    }
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  return (
    <div
      id="card-image-outer-container"
      ref={(el) => {
        tiltAreaEl = el;
      }}
      class="box-border grow-0 shrink-0 w-full sm:w-auto sm:px-12 lg:px-16 overscroll-none touch-none"
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointer}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={resetPointer}
    >
      <div
        id="card-image-container"
        class={[
          "relative aspect-360/618 w-[calc(4rem+40vw)] sm:w-auto sm:h-96 lg:h-128 mx-auto my-10 sm:my-2 overflow-hidden rounded-lg origin-center transition-[opacity,scale,transform,box-shadow] ease-out",
          {
            "opacity-100 scale-100": props.show,
            "opacity-75 scale-75": !props.show,
          },
        ]}
        style={{
          transform: props.show ? tiltTransform() : "none",
          "transition-duration": "300ms, 300ms, 200ms, 200ms",
          "box-shadow": `${-pointer().x / 96}px ${-pointer().y / 96}px 0 -0.2px #778, ${-pointer().x / 20 + 8}px ${-pointer().y / 20 + 12}px ${distance() * 2 + 40}px -12px rgba(0,10,20,${1 - distance() / 36})`,
        }}
      >
        <div
          class="w-full h-full bg-cover relative"
          style={{
            "background-image": cardThumb(),
            "background-color": "#c7c8b6",
          }}
        >
          <div
            class="w-full h-full absolute left-0 top-0 bg-contain bg-no-repeat bg-center z-20 mix-blend-lighten"
            style={{
              "background-image": `url(${snarot_logo_laser})`,
              filter: `hue-rotate(${hueShift()}deg)`,
              opacity: distance() / 16 + 0.1,
            }}
          ></div>
          <div
            class="w-full h-full absolute left-0 top-0 bg-sky-950 z-10 transition-opacity"
            style={{
              "transition-duration": "80ms",
              opacity: Math.max(0, distance() / 160 - 0.05),
            }}
          ></div>
          {cardImageEl()}
        </div>
      </div>
    </div>
  );
}
