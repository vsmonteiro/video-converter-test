export async function getViews(videoId: number): Promise<number> {
  const response = await fetch(
    `${process.env.DJANGO_API_URL}/videos/${videoId}/views`,
    {
      cache: "no-cache",
      // next: {
      //   revalidate: 60
      // }
    }
  );

  return (await response.json()).views;
}

export type VideoViews = {
  videoId: number;
  views?: number;
};

export async function VideoViews(props: VideoViews) {
  const { videoId, views: propViews } = props;
  const views = propViews ? propViews : await getViews(videoId);
  return <span>{views} visualizações</span>;
}
