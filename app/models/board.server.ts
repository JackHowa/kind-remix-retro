type Board = {
  slug: string;
  title: string;
};

export async function getBoards(): Promise<Array<Board>> {
  return [
    {
      slug: "robust-convo-on-robustness",
      title: "Robust convo on robustness",
    },
    {
      slug: "hunting-socks-accident-in-the-woods",
      title: "Hunting socks accident in the woods",
    },
    {
      slug: "engineers-talking-about-prs",
      title: "Engineers talking about prs",
    },
  ];
}
