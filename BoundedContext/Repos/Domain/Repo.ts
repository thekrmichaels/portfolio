interface Language {
  language: string;
}

const Repo = {
  name: "",
  homepage: "",
  html_url: "",
  description: "",
  languages: [] as Language[],
};

export default Repo;
