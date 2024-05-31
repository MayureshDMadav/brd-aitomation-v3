import { GetFormStats } from "@/actions/form"

export default function Home() {
  return <div className="container pt-4">Hello</div>
}


const cardStatsWrapper = async() =>{
  const stats = await GetFormStats();
  return <StatsCard loading={false} data={stats}/>
}



