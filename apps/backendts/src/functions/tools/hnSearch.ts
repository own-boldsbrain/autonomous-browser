import { log } from "@restackio/ai/function";
import axios from "axios";
import { z } from "zod";

export const hnSearchInput = z.object({
  query: z.string().optional().describe("The query for search"),
});

export type HnSearchInput = z.infer<typeof hnSearchInput>;

export async function toolHnSearch({ query }: HnSearchInput) {
  try {
    // Fetch the latest stories IDs
    const { data } = await axios.get(
      `https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&query=${query}&hitsPerPage=5&numericFilters=points>2`
    );

    log.info("hnSearch", { data });
    return data;
  } catch (error) {
    log.error("Error fetching Hacker News posts:", { error });
    return [];
  }
}
