import { createSignal, createEffect, onCleanup } from "solid-js";
import { PeopleMultiSelect } from "./select/PeopleMultiSelect";
import {
  personToEvent,
  findContemporaries
} from "./timelineUtils";

import "@thisbeyond/solid-select/style.css";
import "./Timeline.css";
import { useWindowWidth } from "../utils/useWindowWidth";

declare global {
  interface Window {
    TL?: any;
  }
}

const PAGE_SIZE = 250;
const TOTAL_FILES = 25;

const base_url=import.meta.env.SERVER_BASE_URL;

export default function Timeline() {
  const [people, setPeople] = createSignal<any[]>([]);
  const [selectedNames, setSelectedNames] = createSignal<string[]>([]);
  const [page, setPage] = createSignal(0);
  const [timelineData, setTimelineData] = createSignal<any>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [numContemporaries, setNumContemporaries] = createSignal(5);
  const width = useWindowWidth();

  let timelineInstance: any = null;

  async function loadAllPeopleFiles() {
    setError(null);
    try {
      const firstRes = await fetch(`${base_url}/data/ranking/people_part_1.json`);
      if (!firstRes.ok) throw new Error(`Failed to load people_part_1.json: ${firstRes.statusText}`);
      const firstData = await firstRes.json();
      setPeople(firstData);

      const filePromises = [];
      for (let i = 2; i <= TOTAL_FILES; i++) {
        filePromises.push(
          fetch(`${base_url}/data/ranking/people_part_${i}.json`)
            .then(res => {
              if (!res.ok) throw new Error(`Failed to load people_part_${i}.json: ${res.statusText}`);
              return res.json();
            })
            .catch(err => {
              console.error(err);
              return [];
            })
        );
      }

      const allChunks = await Promise.all(filePromises);
      setPeople([...firstData, ...allChunks.flat()]);
    } catch (err: any) {
      setPeople([]);
      setError(err.message || "Failed to load data.");
    }
  }

  loadAllPeopleFiles();

  const filteredPeople = () => {
    if (selectedNames().length === 0) return people();

    const selected = people().filter(p =>
      selectedNames().includes(p.name.replace(/_/g, " "))
    );
    const contemporaries = findContemporaries(selected, people(), numContemporaries()); 
    const combined = [...selected, ...contemporaries];
    const seen = new Set();
    return combined.filter(p => {
      const key = p.wikidata_code || p.curid || p.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const pagedPeople = () =>
    filteredPeople().slice(page() * PAGE_SIZE, (page() + 1) * PAGE_SIZE);

  createEffect(() => {
    const events = pagedPeople().map(personToEvent);
    setTimelineData({
      title: {
        text: {
          headline: "Contemporaries",
          text: "<p>See the contemporaries of your favorite people.</p>",
        },
        media: {
          url: "./contemporaries.png",
        }
      },
      events,
    });
  });

  createEffect(() => {
    const data = timelineData();
    if (data && window.TL && window.TL.Timeline) {
      if (timelineInstance) timelineInstance.destroy?.();
      timelineInstance = new window.TL.Timeline("timeline-embed", data);
    }
  });

  let timelineContainer: HTMLDivElement | undefined;

  function handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else if (timelineContainer?.requestFullscreen) {
      timelineContainer.requestFullscreen();
    } else {
      alert("Fullscreen is not supported on this device/browser.");
    }
  }

  onCleanup(() => {
    if (timelineInstance) timelineInstance.destroy?.();
  });

  return (
    <div ref={timelineContainer} class="timeline-container">
      <button
        class="fullscreen-btn"
        onClick={handleFullscreen}
        aria-label="Go Fullscreen"
      >
        ⛶ {width() > 600 ? "Fullscreen" : ""}
      </button>
      <div class="timeline-controls">
        {error() && <div class="timeline-error">{error()}</div>}
        <label>
          <PeopleMultiSelect
            people={people().map(p => ({ name: p.name.replace(/_/g, " ") }))}
            value={selectedNames()}
            onChange={names => {
              setSelectedNames(names);
              setPage(0);
            }}
          />
        </label>
        <br/>
        <label class="timeline-label">
          Number of contemporaries:&nbsp;&nbsp;
          <input
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            class="timeline-num-input"
            value={numContemporaries()}
            onInput={e => {
              const val = parseInt(e.currentTarget.value.replace(/\D/g, ""), 10);
              if (!isNaN(val) && val > 0) setNumContemporaries(val);
              else if (e.currentTarget.value === "") setNumContemporaries(1);
            }}
            style="width: 4em;"
            autocomplete="off"
            spellcheck={false}
          />
        </label>
      </div>
      <div id="timeline-embed" style="width: 100%; height: 600px"></div>

      <div class="timeline-pagination">
        <div >
          {`Showing the top ${page() * pagedPeople().length}-${(page() + 1) * pagedPeople().length} of ${filteredPeople().length} people`}
        </div>
        <button
          disabled={page() === 0}
          onClick={() => setPage(page() - 1)}
          class="timeline-pagination-btn"
        >
          Prev
        </button>
        <button
          disabled={(page() + 1) * PAGE_SIZE >= filteredPeople().length}
          onClick={() => setPage(page() + 1)}
          class="timeline-pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}