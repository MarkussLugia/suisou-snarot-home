import { children, createMemo, Loading } from "solid-js";
import { paths, Router } from "./router";
import { useLocation } from "@solidjs/router";
import "./App.css";
import { createSwitchTransition } from "@solid-primitives/transition-group";
import { JSX } from "@solidjs/web";

function NavTab(props: { href: string; title: string }) {
  const location = useLocation();
  return (
    <div class="relative w-24 h-24 mx-4">
      <div
        class={[
          "absolute z-10 w-32 h-16 scale-y-[2] origin-center top-2 -left-4 mix-blend-screen blur-xs transition-all duration-700",
          {
            "opacity-0 -translate-y-8": location.pathname != props.href,
            "opacity-100 translate-y-0 cursor-default text-shadow-black text-shadow-sm":
              location.pathname === props.href,
          },
        ]}
      >
        <div class="wave-front absolute w-full h-full blur-xs bg-no-repeat bg-blend-screen mix-blend-screen bg-center bg-cover opacity-75"></div>
        <div class="wave-back absolute w-24 left-16 h-full blur-sm bg-no-repeat bg-blend-screen mix-blend-screen bg-center bg-cover opacity-70"></div>
        <div class="wave-back absolute w-24 right-16 h-full blur-sm bg-no-repeat bg-blend-screen mix-blend-screen bg-center bg-cover opacity-60"></div>
      </div>
      <a
        class={[
          "absolute flex justify-center items-center z-20 w-24 h-20 top-0",
          {
            "cursor-default": location.pathname === props.href,
          },
        ]}
        href={props.href}
      >
        <div
          class={[
            "transition-colors duration-500 text-2xl font-normal text-center",
            {
              "text-sky-300": location.pathname != props.href,
              "text-sky-100": location.pathname === props.href,
            },
          ]}
        >
          {props.title}
        </div>
      </a>
    </div>
  );
}

export function RouteTransition(props: { children?: JSX.Element }) {
  const node = createMemo(() => {
    const list = children(() => props.children)();
    return (<div>{list}</div>) as HTMLDivElement;
  });

  const rendered = createSwitchTransition(node, {
    mode: "out-in",
    onEnter(el, done) {
      queueMicrotask(() => {
        el.animate([{ opacity: 0 }, { opacity: 1 }], 300)
          .finished.then(done)
          .catch(done);
      });
    },
    onExit(el, done) {
      el.animate([{ opacity: 1 }, { opacity: 0 }], 150)
        .finished.then(done)
        .catch(done);
    },
  });

  return <>{rendered()}</>;
}

export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <nav
            id="nav"
            class="font-usmcc-serif flex justify-center items-center fixed z-50 w-screen top-0 left-0"
          >
            <NavTab href={paths.cards()} title="卡牌" />
            <NavTab href={paths.rules()} title="规则" />
          </nav>
          <div id="nav-bg" class="w-screen h-24 top-0 left-0 fixed z-30"></div>
          <Loading fallback={<main class="px-4 py-12">Loading…</main>}>
            <RouteTransition>{props.children}</RouteTransition>
          </Loading>
        </>
      )}
    </Router>
  );
}
