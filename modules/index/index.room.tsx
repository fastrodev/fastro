import { JSX } from "preact/jsx-runtime";
import { useContext, useState } from "preact/hooks";
import { AppContext } from "@app/modules/index/index.context.ts";
import useFetch from "@app/modules/hook/fetch.ts";
import ArrowDownSvg from "@app/components/icons/arrow-down.tsx";

export function Room(
  props: { title: string; id: string; checked?: boolean; disabled?: boolean },
) {
  const state = useContext(AppContext);
  const { data } = useFetch(`/api/room/${props.id}`);
  const [s, setS] = useState("01JAC4GM721KGRWZHG53SMXZP0" === props.id);

  const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
    const target = e.target as HTMLInputElement;
    const ss = target.value === props.id;
    setS(ss);
    state.room.value = data as {
      name: string;
      id: string;
    };
  };

  return (
    <li
      key={props.id}
      class={`inline-flex justify-between`}
    >
      <div class={`inline-flex items-start gap-x-2`}>
        <input
          id={props.id}
          name="room"
          type="radio"
          value={props.id}
          onChange={handleChange}
          defaultChecked={s}
          disabled={props.disabled}
          class="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 border-gray-500"
        />
        <span class={`capitalize`}>{props.title}</span>
      </div>
      <ArrowDownSvg />
    </li>
  );
}
