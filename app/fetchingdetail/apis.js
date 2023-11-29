export async function anilistAPI(title) {
  const query = `
  query ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: MANGA, sort: SEARCH_MATCH) {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        countryOfOrigin
        coverImage {
          extraLarge
        }
        description
        averageScore
        synonyms
        genres
        siteUrl
      }
    }
  }
  `;

  // for (const com of scrap) {
  var variables = {
    search: title,
    perPage: 2,
  };

  var url = "https://graphql.anilist.co";
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  };

  try {
    const req = await fetch(url, options);
    const res = await req.json();

    return res.data.Page.media;
  } catch (err) {
    return err.message;
  }
}
