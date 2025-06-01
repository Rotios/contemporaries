export function parseYear(val: any) {
  if (!val) return "";
  const yearStr = String(val).split(".")[0];
  return parseInt(yearStr, 10);
}

export function personToEvent(person: any) {
  return {
    media: {
      // url: `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&redirects=&titles=${person.name}&exintro=1&format=json&callback=jsonp1`,
      url: `https://en.wikipedia.org/wiki/${person.name}`,
  
      caption: person.name.replace(/_/g, " "),
      credit: 'Wikipedia',
    },
    start_date: {
      year: parseYear(person.birth_estimation || person.birth),
    },
    end_date: person.death_estimation || person.death ? {
      year: parseYear(person.death_estimation || person.death),
    } : undefined,
    text: {
      headline: person.name.replace(/_/g, " "),
      text: `<p>${(person.level3_main_occ || person.level2_main_occ || person.level1_main_occ || "")}<br/>${(person.citizenship_1_b || "")?.replace(/_/g, " ")}${(person.citizenship_2_b ? ", " + person.citizenship_2_b : "")?.replace(/_/g, " ")}</p>`,
    },
    unique_id: person.wikidata_code || person.curid,
  };
}

export function getYears(p: any) {
  return {
    birth: parseYear(p.birth_estimation || p.birth),
    death: parseYear(p.death_estimation || p.death),
  };
}

export function findContemporaries(selected: any[], people: any[], topN = 25) {
  let contemporaries: any[] = [];
  const seen = new Set(
    selected.map(p => p.wikidata_code || p.curid || p.name)
  );

  for (const sel of selected) {
    const { birth: selBirth, death: selDeath } = getYears(sel);
    let count = 0;
    for (const p of people) {
      if (p === sel) continue;
      const key = p.wikidata_code || p.curid || p.name;
      if (seen.has(key)) continue;
      const { birth, death } = getYears(p);
      if (
        birth &&
        death &&
        selBirth &&
        selDeath &&
        birth <= selDeath &&
        death >= selBirth
      ) {
        contemporaries.push(p);
        seen.add(key);
        count++;
        if (count >= topN) break;
      }
    }
  }
  return contemporaries;
}