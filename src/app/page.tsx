import Image from "next/image";
import Link from "next/link";

type News = {
  status: string;
  totalResults: number;
  articles: Array<Articles>;
}

type Articles = {
  source: Source;
  author: string | null;
  title: string | null;
  description: string | null;
  url: string | null;
  urlToImage: string | null;
  publishedAt: string | null;
  content: string | null;
}

type Source = {
  id: string | null;
  name: string | null;
}

export default async function Home(): Promise<JSX.Element> {
  const fetchJSONData = async (): Promise<Articles[] | null> => {
    try{
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=jp&apiKey=${process.env.API_KEY}`, { next: { revalidate: 86400 }});
      const data: News = await response.json();
      return data.articles;
    }catch(error){
      return null;
    }
  }
  const news = await fetchJSONData();
  return (
    <main className="grid grid-cols-3 gap-3">
      {(news) && news.map((data: Articles, index: number) => {
        return (
          <div key={index} className={"bg-slate-50"}>
            <Image draggable={false} className="w-full object-cover rounded-t" src={data.urlToImage ? data.urlToImage: "https://placehold.co/512x256/png"} width={512} height={256} alt={data.title ? data.title : ""} title={data.title ? data.title : "ไม่ปรากฏ"}/>
            <div className="p-3">
            <Link href={data.url ? data.url : "/"} target={"_blank"}>
            <h3 className="truncate text-lg w-full max-w-96 hover:text-blue-700" title={data.title ? data.title : "ไม่ปรากฏ"}>{data.title ? data.title : "ไม่ปรากฏ"}</h3>
            </Link>
            <details className="truncate text-base" title={`${data.description ? data.description : "ไม่ปรากฏ"}`}>{`${data.description ? data.description : "ไม่ปรากฏ"}`}</details>
            <p className="truncate text-sm text-red-500" title={`เผยแพร่โดย: ${data.author ? data.author : "ไม่ปรากฏ"}`}>{`เผยแพร่โดย: ${data.author ? data.author : "ไม่ปรากฏ"}`}</p>
            <p className="truncate text-xs text-gray-500" title={`วันที่เผยแพร่: ${data.publishedAt ? new Date(data.publishedAt).toDateString() : "ไม่ปรากฏ"}`}>{`วันที่เผยแพร่: ${data.publishedAt ? new Date(data.publishedAt).toDateString() : "ไม่ปรากฏ"}`}</p>
            </div>
          </div>
        )
      })}
    </main>
  );
}
