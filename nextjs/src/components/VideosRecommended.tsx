import { VideoCard } from "./VideoCard";
import { VideoModel } from "../models";
import Link from "next/link";

export async function getVideosRecommended(
  videoId: number
): Promise<VideoModel[]> {
  const response = await fetch(`${process.env.DJANGO_API_URL}/videos/${videoId}/recommended`, {
    cache: "no-cache",
  });

  return response.json();
}

export type VideoRecommendListProps = {
  videoId: number;
};

export async function VideosRecommendList(props: VideoRecommendListProps) {
  const { videoId } = props;
  const videos = await getVideosRecommended(videoId);
  return videos.length ? (
    videos.map((video) => (
      <Link key={video.id} href={`/${video.slug}/play`} >
        <VideoCard
          title={video.title}
          thumbnail={video.thumbnail}
          views={video.views}
          orientation="horizontal"
        />
      </Link>
    ))
  ) : (
    <div className="flex items-center justify-center w-full col-span-full">
      <p className="text-gray-600 text-xl font-semibold">
        Nenhum vídeo encontrado.
      </p>
    </div>
  );
}