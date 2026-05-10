"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getProjects, addProject, updateProject, deleteProject,
  getSkills, addSkill, updateSkill, deleteSkill,
  getMessages, markMessageRead, uploadImage,
  type Project, type Skill, type Message,
} from "@/lib/firestore";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "projects" | "skills" | "messages";

export default function DashboardClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("projects");
  const [ready, setReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pForm, setPForm] = useState<Omit<Project,"id">>({ title:"", description:"", image:"", tags:[], liveUrl:"", githubUrl:"", order:0 });
  const [pEdit, setPEdit] = useState<string|null>(null);
  const [pFile, setPFile] = useState<File|null>(null);
  const [pBusy, setPBusy] = useState(false);
  const [sForm, setSForm] = useState<Omit<Skill,"id">>({ name:"", category:"", level:80 });
  const [sEdit, setSEdit] = useState<string|null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/admin");
      else { setReady(true); load(); }
    });
  }, []);

  async function load() {
    const [p,s,m] = await Promise.all([getProjects(), getSkills(), getMessages()]).catch(() => [[],[],[]]) as [Project[],Skill[],Message[]];
    setProjects(p); setSkills(s); setMessages(m);
  }

  async function saveProject() {
    setPBusy(true);
    let img = pForm.image;
    if (pFile) img = await uploadImage(pFile, `projects/${Date.now()}_${pFile.name}`);
    const d = { ...pForm, image: img };
    if (pEdit) await updateProject(pEdit, d); else await addProject(d);
    setPForm({ title:"", description:"", image:"", tags:[], liveUrl:"", githubUrl:"", order:0 });
    setPEdit(null); setPFile(null); setPBusy(false);
    setProjects(await getProjects());
  }

  async function saveSkill() {
    if (sEdit) await updateSkill(sEdit, sForm); else await addSkill(sForm);
    setSForm({ name:"", category:"", level:80 }); setSEdit(null);
    setSkills(await getSkills());
  }

  if (!ready) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
    </div>
  );

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-white/30 text-xs mt-0.5">Portfolio удирдах</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-xs text-white/30 hover:text-white transition-colors">Сайт харах →</a>
          <button onClick={() => signOut(auth).then(() => router.push("/admin"))}
            className="px-4 py-2 text-xs uppercase tracking-widest border border-white/10 rounded-lg hover:border-red-400/40 hover:text-red-400 transition-all">
            Гарах
          </button>
        </div>
      </div>

      <div className="border-b border-white/10 px-6 flex">
        {(["projects","skills","messages"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-4 text-sm uppercase tracking-widest transition-all relative ${tab===t ? "text-orange-400" : "text-white/30 hover:text-white"}`}>
            {t==="messages" && unread>0 && (
              <span className="absolute top-3 right-1 w-4 h-4 bg-orange-500 rounded-full text-xs flex items-center justify-center">{unread}</span>
            )}
            {t}
            {tab===t && <motion.div layoutId="ul" className="absolute bottom-0 left-0 right-0 h-px bg-orange-400" />}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {tab==="projects" && (
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">{pEdit ? "Project засах" : "Шинэ Project нэмэх"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{k:"title",l:"Гарчиг",p:"Project нэр"},{k:"liveUrl",l:"Live URL",p:"https://..."},{k:"githubUrl",l:"GitHub",p:"https://github.com/..."},{k:"order",l:"Дараалал",p:"0"}].map(f => (
                  <div key={f.k}>
                    <label className="block text-xs text-white/30 uppercase tracking-widest mb-1.5">{f.l}</label>
                    <input value={String((pForm as Record<string,unknown>)[f.k] ?? "")}
                      onChange={e => setPForm({...pForm,[f.k]:e.target.value})} placeholder={f.p}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-400/50 transition-all" />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-xs text-white/30 uppercase tracking-widest mb-1.5">Тайлбар</label>
                  <textarea rows={3} value={pForm.description} onChange={e => setPForm({...pForm,description:e.target.value})} placeholder="Project тайлбар..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-400/50 transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-white/30 uppercase tracking-widest mb-1.5">Tags (таслалаар)</label>
                  <input value={pForm.tags.join(", ")} onChange={e => setPForm({...pForm,tags:e.target.value.split(",").map(t=>t.trim()).filter(Boolean)})} placeholder="React, Firebase"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-400/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-white/30 uppercase tracking-widest mb-1.5">Зураг upload</label>
                  <input type="file" accept="image/*" onChange={e => setPFile(e.target.files?.[0]||null)}
                    className="w-full text-white/50 text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-orange-500/20 file:text-orange-400 file:text-xs file:cursor-pointer" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={saveProject} disabled={pBusy||!pForm.title}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white text-sm rounded-xl transition-all disabled:opacity-40 uppercase tracking-widest">
                  {pBusy ? "Хадгалж байна..." : pEdit ? "Шинэчлэх" : "Нэмэх"}
                </button>
                {pEdit && <button onClick={() => {setPEdit(null);setPForm({title:"",description:"",image:"",tags:[],liveUrl:"",githubUrl:"",order:0});}}
                  className="px-6 py-2.5 border border-white/10 text-white/50 text-sm rounded-xl hover:border-white/30 transition-all">Цуцлах</button>}
              </div>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {projects.map(p => (
                  <motion.div key={p.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20}}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-blue-500/20 flex-shrink-0 overflow-hidden">
                      {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.title}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {p.tags.slice(0,3).map(t => <span key={t} className="px-1.5 py-0.5 text-xs bg-white/10 rounded text-white/40">{t}</span>)}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => {setPEdit(p.id!);setPForm({title:p.title,description:p.description,image:p.image,tags:p.tags,liveUrl:p.liveUrl||"",githubUrl:p.githubUrl||"",order:p.order||0});}}
                        className="px-3 py-1.5 text-xs border border-white/10 rounded-lg hover:border-orange-400/40 hover:text-orange-400 transition-all">Засах</button>
                      <button onClick={() => deleteProject(p.id!).then(() => setProjects(projects.filter(x=>x.id!==p.id)))}
                        className="px-3 py-1.5 text-xs border border-white/10 rounded-lg hover:border-red-400/40 hover:text-red-400 transition-all">Устгах</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!projects.length && <p className="text-center text-white/20 py-12">Project алга</p>}
            </div>
          </div>
        )}

        {tab==="skills" && (
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">{sEdit ? "Skill засах" : "Шинэ Skill нэмэх"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-white/30 uppercase tracking-widest mb-1.5">Нэр</label>
                  <input value={sForm.name} onChange={e => setSForm({...sForm,name:e.target.value})} placeholder="React / Next.js"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-400/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-white/30 uppercase tracking-widest mb-1.5">Категори</label>
                  <input value={sForm.category} onChange={e => setSForm({...sForm,category:e.target.value})} placeholder="Frontend / Backend"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-400/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-white/30 uppercase tracking-widest mb-1.5">Түвшин: {sForm.level}%</label>
                  <input type="range" min={10} max={100} value={sForm.level} onChange={e => setSForm({...sForm,level:Number(e.target.value)})} className="w-full accent-orange-400 mt-3" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={saveSkill} disabled={!sForm.name||!sForm.category}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white text-sm rounded-xl transition-all disabled:opacity-40 uppercase tracking-widest">
                  {sEdit ? "Шинэчлэх" : "Нэмэх"}
                </button>
                {sEdit && <button onClick={() => {setSEdit(null);setSForm({name:"",category:"",level:80});}}
                  className="px-6 py-2.5 border border-white/10 text-white/50 text-sm rounded-xl hover:border-white/30 transition-all">Цуцлах</button>}
              </div>
            </div>
            <div className="space-y-2">
              {skills.map(s => (
                <div key={s.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-medium text-sm">{s.name}</span>
                      <span className="px-2 py-0.5 text-xs bg-white/10 rounded text-white/40">{s.category}</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full"><div className="h-full bg-orange-400 rounded-full" style={{width:`${s.level}%`}} /></div>
                  </div>
                  <span className="text-white/30 text-sm w-10 text-right">{s.level}%</span>
                  <div className="flex gap-2">
                    <button onClick={() => {setSEdit(s.id!);setSForm({name:s.name,category:s.category,level:s.level});}}
                      className="px-3 py-1 text-xs border border-white/10 rounded-lg hover:border-orange-400/40 hover:text-orange-400 transition-all">Засах</button>
                    <button onClick={() => deleteSkill(s.id!).then(() => setSkills(skills.filter(x=>x.id!==s.id)))}
                      className="px-3 py-1 text-xs border border-white/10 rounded-lg hover:border-red-400/40 hover:text-red-400 transition-all">Устгах</button>
                  </div>
                </div>
              ))}
              {!skills.length && <p className="text-center text-white/20 py-12">Skill алга</p>}
            </div>
          </div>
        )}

        {tab==="messages" && (
          <div className="space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`bg-white/5 border rounded-xl p-5 transition-all ${m.read ? "border-white/5 opacity-60" : "border-orange-400/20"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold">{m.name}</span>
                      {!m.read && <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded-full">Шинэ</span>}
                    </div>
                    <p className="text-white/40 text-sm mb-3">{m.email}</p>
                    <p className="text-white/70 text-sm leading-relaxed">{m.message}</p>
                  </div>
                  {!m.read && (
                    <button onClick={() => markMessageRead(m.id!).then(() => setMessages(messages.map(x => x.id===m.id ? {...x,read:true} : x)))}
                      className="flex-shrink-0 px-3 py-1.5 text-xs border border-white/10 rounded-lg hover:border-green-400/40 hover:text-green-400 transition-all">
                      Уншсан
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!messages.length && <p className="text-center text-white/20 py-12">Мессеж алга</p>}
          </div>
        )}
      </div>
    </div>
  );
}
