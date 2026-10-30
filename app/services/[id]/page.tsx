import CivicApp from "@/components/CivicApp";
import { services } from "@/lib/catalog";
import { notFound } from "next/navigation";
export default async function ServicePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;if(!services.some(s=>s.id===id))notFound();
  return <CivicApp initialView="services" initialServiceId={id}/>;
}
