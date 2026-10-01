import { Title } from "@solidjs/meta";
import { createMemo, createSignal, For, Loading, SourceAccessor } from "solid-js";

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

  /** 能够匹配上一张卡牌的颜色。"u"代表允许所有颜色。 */
  prevColor: "r" | "g" | "b" | "y" | "u";

  /** 要求匹配下一张卡牌的颜色。"u"代表允许所有颜色。 */
  nextColor: "r" | "g" | "b" | "y" | "u";

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
  return (
    <main class="text-sky-200 font-usmcc-serif flex flex-col justify-center items-center relative z-0 pt-24">
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
              <SlugCardGrid data={item.data()} title={item.title} />
            </Loading>
          </div>
        )}
      </For>
    </main>
  );
}

function SlugCardGrid(props: { data: SlugCardJSON; title: string }) {
  return (
    <div class="text-left w-full box-border px-2 sm:px-0">
      <h2 class="text-5xl px-2 sm:px-1 py-6 text-left w-full inline-block">{props.title}</h2>
      <For each={props.data.list}>{(card) => <SlugCardThumb src={cardBaseURL + card.thu} />}</For>
    </div>
  );
}

function SlugCardThumb(props: { src: string }) {
  let [loaded, setLoaded] = createSignal(false);
  return (
    <div
      class="aspect-360/618 w-[calc(25%-0.5rem)] mx-1 sm:w-32 sm:mx-2 sm:my-2.5 overflow-hidden rounded-sm bg-[#c7c8b6] inline-block text-[0px] transition-transform duration-500 ease-out"
      style={{ rotate: loaded() ? `${Math.random() * 4 - 2}deg` : "0deg" }}
    >
      <img
        class={["w-full transition-opacity duration-300", { "opacity-100": loaded(), "opacity-0": !loaded() }]}
        src={props.src}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      ></img>
    </div>
  );
}
