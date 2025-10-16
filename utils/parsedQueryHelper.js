module.exports = (query) => {
  if (!query || typeof query !== "object") return {};

  const q = { ...query };

  const excluded = ["page", "sort", "limit", "fields", "search"];
  excluded.forEach((f) => delete q[f]);

  const tryParse = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val !== "string") return val;

    try {
      return JSON.parse(val);
    } catch (e) {
      if (val.includes(",")) {
        return val
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v !== "");
      }
      return val;
    }
  };

  for (const key of Object.keys(q)) {
    q[key] = tryParse(q[key]);
  }

  const parsed = {};

  const toNumberIfPossible = (v) => {
    if (typeof v === "string" && v !== "" && !isNaN(v)) return Number(v);
    return v;
  };

  for (const [key, val] of Object.entries(q)) {
    if (
      val === null ||
      val === "" ||
      (Array.isArray(val) && val.length === 0)
    ) {
      continue;
    }

    if (Array.isArray(val)) {
      parsed[key] = {
        $in: val.map((v) =>
          v === "true" ? true : v === "false" ? false : toNumberIfPossible(v)
        ),
      };
      continue;
    }

    if (typeof val === "object" && val !== null) {
      const inner = {};
      for (const [k2, v2] of Object.entries(val)) {
        if (v2 === null || v2 === "") continue;
        const numeric = toNumberIfPossible(v2);
        if (["gte", "gt", "lte", "lt"].includes(k2)) {
          inner[`$${k2}`] =
            numeric === "true" ? true : numeric === "false" ? false : numeric;
        } else {
          inner[k2] =
            numeric === "true" ? true : numeric === "false" ? false : numeric;
        }
      }
      if (Object.keys(inner).length > 0) parsed[key] = inner;

      continue;
    }

    if (val === "true") parsed[key] = true;
    else if (val === "false") parsed[key] = false;
    else parsed[key] = toNumberIfPossible(val);
  }

  return parsed;
};
