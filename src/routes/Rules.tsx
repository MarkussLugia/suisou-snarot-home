import { Title } from "@solidjs/meta";
import { Element } from "solid-js";

export default function Rules() {
  return (
    <div class="w-screen h-screen overflow-y-scroll">
      <main class="text-sky-200 font-usmcc-serif flex flex-col justify-center items-center relative z-0 pt-24">
        <Title>规则 - 塔螺牌</Title>

        <div class="text-left w-full sm:w-xl lg:w-252 px-4 sm:px-2 lg:px-0">
          <div class="text-7xl lg:text-9xl text-sky-300 pt-8 sm:pt-20 lg:pt-24">游玩规则</div>
          <div class="text-3xl lg:text-2xl text-sky-500 pl-0 sm:pl-0.5 pt-12 lg:pt-8">
            在岛以外的世界，王们放弃了战斗和野蛮。仆役变成卡牌，以占卜替代将要发生的争斗。
            <br />
            帮助新到来的王子与王女们，找到一件能成为其王者之路的道具，
            <br class="hidden lg:inline" />
            成为他们的牌组，成长自己的本源。
          </div>
          <div class="text-4xl lg:text-4xl text-sky-500 pl-0 sm:pl-0.5 pb-8 pt-8 lg:pb-16 lg:pt-0">
            你们的舞蹈很稚嫩，
            <br class="inline lg:hidden" />
            <span class="text-sky-100">但充满勇气。</span>
          </div>
        </div>
        <RuleHeader>基本规则</RuleHeader>
        <RuleHeader2>开局</RuleHeader2>
        <RuleContent>
          塔螺牌的基础规则与 UNO! 牌基本一致。
          <br />
          四名玩家随机决定顺序，每位玩家抽取 <del>等量的</del> <i>几张？</i> 手牌。
          <br />
          抽取一张数字牌作为场地引导牌，本局游戏即开始。
        </RuleContent>
        <RuleHeader2>轮流出牌</RuleHeader2>
        <RuleContent>
          游戏起始时，玩家按顺时针顺序依次出牌。
          <br />
          每位玩家每回合打出 1 张牌。能够打出的牌受场地颜色与数字的限制。
          <br />
          手牌中没有能打出的牌时，从牌库抽取 1 张牌加入手牌，结束回合。
        </RuleContent>
        <RuleHeader2>数字牌（小阿尔卡纳）</RuleHeader2>
        <RuleContent>
          卡牌与当前场地颜色一致或数字一致时，即可打出这张数字牌。
          <br />
          打出后，将更新当前的场地颜色与数字。
        </RuleContent>
        <RuleHeader2>效果牌</RuleHeader2>
        <RuleContent>
          <i>WIP</i>
        </RuleContent>
        <RuleHeader2>获胜</RuleHeader2>
        <RuleContent>
          最先将手牌打空的玩家获胜。
          <br />
          要一气呵成尽快打出所有手牌，还是用各种策略阻碍对手出牌呢……？
        </RuleContent>
        <RuleHeader>特殊卡牌效果</RuleHeader>
        <RuleHeader2>反转</RuleHeader2>
        <RuleContent>打出后，从旧顺序的上一位玩家开始，以反转的回合顺序继续游戏。</RuleContent>
        <RuleHeader2>禁止</RuleHeader2>
        <RuleContent>打出后，按照打出后的回合顺序，下一位玩家被跳过 1 回合，无法出牌。</RuleContent>
        <RuleHeader2>抽牌预言与延时</RuleHeader2>
        <RuleContent>
          打出后，按照打出后的回合顺序，下一位玩家被附加抽牌预言。
          <br />
          附加后，除了被附加的初始回合以外，每一次轮到该玩家的回合，抽牌预言的延时数字减少 1。
          <br />
          延时指示为 0 时，抽牌预言将立即发动。
        </RuleContent>
        <RuleHeader>特殊事件“塔”</RuleHeader>
      </main>
    </div>
  );
}

function RuleHeader(props: { children: Element | string }) {
  return (
    <div class="text-left w-full box-border sm:w-xl lg:w-252 px-2 sm:px-0">
      <h2 class="text-5xl px-2 sm:px-1 pt-10 pb-4 text-left w-full inline-block">
        {props.children}
      </h2>
    </div>
  );
}

function RuleHeader2(props: { children: Element | string }) {
  return (
    <div class="text-left w-full box-border sm:w-xl lg:w-252 px-2 sm:px-0">
      <h2 class="text-3xl text-sky-300 px-2 sm:px-1 pt-3 pb-2 text-left w-full inline-block">
        {props.children}
      </h2>
    </div>
  );
}

function RuleContent(props: { children: Element | string | (Element | string)[] }) {
  return (
    <div class="text-sky-200 text-left text-xl w-full box-border sm:w-xl lg:w-252 px-4 sm:px-1 pb-2">
      {props.children}
    </div>
  );
}
