import { createSignal, Show, For } from "solid-js";
import "./PeopleMultiSelect.css";
import { useWindowWidth } from "../../utils/useWindowWidth";

export function PeopleMultiSelect(props: {
    people: { name: string }[];
    value: string[];
    onChange: (names: string[]) => void;
}) {

    const width = useWindowWidth();
    const [input, setInput] = createSignal("");
    const [showDropdown, setShowDropdown] = createSignal(false);

    const filtered = () => {
        const q = input().toLowerCase();
        if (q.length < 3) return [];
        return props.people
            .filter(
                (p) =>
                    p.name.toLowerCase().includes(q) &&
                    !props.value.includes(p.name)
            )
            .slice(0, 100);
    };

    function addName(name: string) {
        props.onChange([...props.value, name]);
        setInput("");
        setShowDropdown(false);
    }

    function removeName(name: string) {
        props.onChange(props.value.filter((n) => n !== name));
    }

    return (
        <div class="pms-container">
            {width() > 600 ? 'Search for people:' : '' }

            <div class="pms-tags">
                <For each={props.value}>
                    {(name) => (
                        <span class="pms-tag">
                            {name}
                            <button
                                type="button"
                                aria-label={`Remove ${name}`}
                                onClick={() => removeName(name)}
                            >
                                ×
                            </button>
                        </span>
                    )}
                </For>
            </div>
            <input
                type="text"
                value={input()}
                onInput={e => {
                    setInput(e.currentTarget.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 120)}
                placeholder="Type at least 3 characters..."
                class="pms-input"
            />
            <Show when={showDropdown() && filtered().length > 0}>
                <ul class="pms-dropdown">
                    <For each={filtered()}>
                        {(p) => (
                            <li
                                class="pms-option"
                                onMouseDown={() => addName(p.name)}
                            >
                                {p.name}
                            </li>
                        )}
                    </For>
                </ul>
            </Show>
        </div>
    );
}