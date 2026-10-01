import { Title } from "@solidjs/meta";

export default function Rules() {
  return (
    <main class="text-sky-200 font-usmcc-serif flex flex-col justify-center items-center relative z-0 pt-24">
      <Title>规则 - 塔螺牌</Title>

      <div class="text-left w-full sm:w-xl lg:w-252 px-4 sm:px-2 lg:px-0">
        <div class="text-7xl lg:text-9xl text-sky-300 pt-8 sm:pt-20 lg:pt-24">
          游玩规则
        </div>
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
      <RuleHeader>卡牌效果</RuleHeader>
      <RuleHeader>特殊事件“塔”</RuleHeader>
    </main>
  );
}

function RuleHeader(props: { children: Element | string }) {
  return (
    <div class="text-left w-full box-border sm:w-xl lg:w-252 px-2 sm:px-0">
      <h2 class="text-5xl px-2 sm:px-1 py-6 text-left w-full inline-block">
        {props.children}
      </h2>
    </div>
  );
}
