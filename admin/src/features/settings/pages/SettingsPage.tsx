import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchSettings, saveSettings, uploadSettingFile } from "@/features/settings/settingsSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Separator } from "@/shared/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import {
    Settings, Globe, Search, Share2, Phone, Home, Palette, Shield, Save, Upload,
    Github, Linkedin, Twitter, Facebook, Instagram, Youtube, Loader2
} from "lucide-react"
import toast from "react-hot-toast"

/* ─── Reusable components ────────────────────────────────── */
const FieldRow = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4">
        <div>
            <Label className="font-semibold text-sm text-slate-700 dark:text-slate-200">{label}</Label>
            {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
        <div className="md:col-span-2">{children}</div>
    </div>
)

/* ─── File Upload Input ─────────────────────────────────── */
const FileInput = ({
    id, accept = "image/*", label, fieldKey, onUploaded, previewUrl
}: {
    id: string; accept?: string; label: string; fieldKey: string;
    onUploaded: (url: string) => void; previewUrl?: string;
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const [uploading, setUploading] = useState(false)

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const res = await dispatch(uploadSettingFile({ file, field: fieldKey })).unwrap()
            onUploaded(res.url)
            toast.success("File uploaded!")
        } catch {
            toast.error("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    return (
        <label htmlFor={id} className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:border-purple-400 hover:bg-purple-50/40 dark:hover:bg-purple-900/10 transition-colors group">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 transition-colors">
                {uploading ? <Loader2 className="h-4 w-4 text-purple-600 animate-spin" /> : <Upload className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{uploading ? "Uploading..." : label}</p>
                {previewUrl && <p className="text-xs text-green-600 truncate max-w-xs">✓ Uploaded</p>}
            </div>
            <input id={id} type="file" accept={accept} className="hidden" onChange={handleChange} disabled={uploading} />
        </label>
    )
}

/* ─── Social Input ──────────────────────────────────────── */
const SocialRow = ({ icon: Icon, label, value, onChange, color }: {
    icon: React.ElementType; label: string; value: string;
    onChange: (v: string) => void; color: string
}) => (
    <FieldRow label={label}>
        <div className="relative">
            <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${color}`} />
            <Input value={value} onChange={e => onChange(e.target.value)} placeholder={`https://...`} className="pl-9 h-11 rounded-xl" />
        </div>
    </FieldRow>
)

/* ─── Save button ───────────────────────────────────────── */
const SaveButton = ({ onClick, saving }: { onClick: () => void; saving: boolean }) => (
    <div className="flex justify-end pt-4">
        <Button onClick={onClick} disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white h-11 px-8 rounded-xl font-semibold shadow-lg shadow-purple-500/25 gap-2 disabled:opacity-70">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </Button>
    </div>
)

/* ─── Tab metadata ──────────────────────────────────────── */
const TABS = [
    { value: "general", label: "General", icon: Settings },
    { value: "seo", label: "SEO", icon: Search },
    { value: "social", label: "Social", icon: Share2 },
    { value: "contact", label: "Contact", icon: Phone },
    { value: "homepage", label: "Homepage", icon: Home },
    { value: "theme", label: "Theme", icon: Palette },
    { value: "security", label: "Security", icon: Shield },
]

/* ══════════════════════════════════════════════════════════
   SETTINGS PAGE
══════════════════════════════════════════════════════════════ */
const SettingsPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { settings, loading, saving } = useSelector((state: RootState) => state.settings)

    // Local form state — each section as its own object
    const [general, setGeneral] = useState({ siteName: "", siteTagline: "", siteDescription: "", siteLogoUrl: "", faviconUrl: "", adminEmail: "" })
    const [seo, setSeo] = useState({ metaTitle: "", metaDescription: "", metaKeywords: "", ogImageUrl: "", googleAnalyticsId: "" })
    const [social, setSocial] = useState({ github: "", linkedin: "", twitter: "", facebook: "", instagram: "", youtube: "" })
    const [contact, setContact] = useState({ contactEmail: "", phone: "", whatsapp: "", address: "", mapEmbedLink: "" })
    const [homepage, setHomepage] = useState({ heroTitle: "", heroSubtitle: "", heroDescription: "", heroImageUrl: "", resumeUrl: "", ctaText: "Hire Me", ctaLink: "/contact" })
    const [theme, setTheme] = useState({ primaryColor: "#7c3aed", darkMode: false })
    const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" })

    const didInit = useRef(false)

    // Fetch settings on mount
    useEffect(() => {
        dispatch(fetchSettings())
    }, [dispatch])

    // Pre-fill forms once settings are loaded
    useEffect(() => {
        if (settings && !didInit.current) {
            didInit.current = true
            setGeneral({ ...general, ...settings.general })
            setSeo({ ...seo, ...settings.seo })
            setSocial({ ...social, ...settings.social })
            setContact({ ...contact, ...settings.contact })
            setHomepage({ ...homepage, ...settings.homepage })
            setTheme({ ...theme, ...settings.theme })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings])

    const handleSave = async (section: string, data: object) => {
        try {
            await dispatch(saveSettings({ [section]: data })).unwrap()
            toast.success("Settings saved!")
        } catch {
            toast.error("Failed to save settings")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        )
    }

    return (
        <div className="p-2 space-y-6 mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your portfolio CMS configuration</p>
                </div>
            </div>

            <Tabs defaultValue="general">
                {/* Tab List */}
                <div className="overflow-x-auto pb-1 -mx-1 px-1">
                    <TabsList className="flex w-max gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 h-auto">
                        {TABS.map(({ value, label, icon: Icon }) => (
                            <TabsTrigger key={value} value={value}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all">
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* ── GENERAL ─────────────────────────────────────────── */}
                <TabsContent value="general">
                    <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white"><Globe className="h-5 w-5 text-purple-500" /> General Settings</CardTitle>
                            <CardDescription>Basic information about your portfolio site.</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-2 divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="py-4 flex items-center gap-5">
                                <Avatar className="h-20 w-20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-md">
                                    {general.siteLogoUrl ? <AvatarImage src={general.siteLogoUrl} alt="Logo" /> : <AvatarFallback className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-2xl font-bold rounded-2xl">S</AvatarFallback>}
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-2">Site Logo</p>
                                    <FileInput id="logo-upload" label="Upload logo" fieldKey="siteLogoUrl" previewUrl={general.siteLogoUrl} onUploaded={url => setGeneral(p => ({ ...p, siteLogoUrl: url }))} />
                                </div>
                            </div>
                            <FieldRow label="Site Name" description="Your portfolio or brand name.">
                                <Input value={general.siteName} onChange={e => setGeneral(p => ({ ...p, siteName: e.target.value }))} placeholder="My Portfolio" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="Site Tagline" description="Short catchy tagline.">
                                <Input value={general.siteTagline} onChange={e => setGeneral(p => ({ ...p, siteTagline: e.target.value }))} placeholder="Building the digital future" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="Site Description" description="Brief description.">
                                <Textarea value={general.siteDescription} onChange={e => setGeneral(p => ({ ...p, siteDescription: e.target.value }))} rows={3} className="rounded-xl resize-none" />
                            </FieldRow>
                            <FieldRow label="Favicon" description="Browser tab icon.">
                                <FileInput id="favicon-upload" label="Upload favicon" accept="image/png,image/x-icon,image/svg+xml" fieldKey="faviconUrl" previewUrl={general.faviconUrl} onUploaded={url => setGeneral(p => ({ ...p, faviconUrl: url }))} />
                            </FieldRow>
                            <FieldRow label="Admin Email" description="Used for notifications.">
                                <Input type="email" value={general.adminEmail} onChange={e => setGeneral(p => ({ ...p, adminEmail: e.target.value }))} placeholder="admin@example.com" className="h-11 rounded-xl" />
                            </FieldRow>
                            <SaveButton onClick={() => handleSave("general", general)} saving={saving} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── SEO ─────────────────────────────────────────────── */}
                <TabsContent value="seo">
                    <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white"><Search className="h-5 w-5 text-green-500" /> SEO Settings</CardTitle>
                            <CardDescription>Optimize your site for search engines.</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-2 divide-y divide-slate-100 dark:divide-slate-800">
                            <FieldRow label="Meta Title">
                                <Input value={seo.metaTitle} onChange={e => setSeo(p => ({ ...p, metaTitle: e.target.value }))} placeholder="Your Name | Portfolio" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="Meta Description" description="150–160 characters.">
                                <Textarea value={seo.metaDescription} onChange={e => setSeo(p => ({ ...p, metaDescription: e.target.value }))} rows={3} className="rounded-xl resize-none" />
                            </FieldRow>
                            <FieldRow label="Meta Keywords" description="Comma-separated.">
                                <Input value={seo.metaKeywords} onChange={e => setSeo(p => ({ ...p, metaKeywords: e.target.value }))} placeholder="developer, react, portfolio" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="OG Image" description="1200×630 recommended.">
                                <FileInput id="og-image" label="Upload OG image" fieldKey="ogImageUrl" previewUrl={seo.ogImageUrl} onUploaded={url => setSeo(p => ({ ...p, ogImageUrl: url }))} />
                            </FieldRow>
                            <FieldRow label="Google Analytics ID">
                                <Input value={seo.googleAnalyticsId} onChange={e => setSeo(p => ({ ...p, googleAnalyticsId: e.target.value }))} placeholder="G-XXXXXXXXXX" className="h-11 rounded-xl font-mono" />
                            </FieldRow>
                            <SaveButton onClick={() => handleSave("seo", seo)} saving={saving} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── SOCIAL ──────────────────────────────────────────── */}
                <TabsContent value="social">
                    <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white"><Share2 className="h-5 w-5 text-blue-500" /> Social Media</CardTitle>
                            <CardDescription>Your social profile URLs.</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-2 divide-y divide-slate-100 dark:divide-slate-800">
                            <SocialRow icon={Github} label="GitHub" value={social.github} onChange={v => setSocial(p => ({ ...p, github: v }))} color="text-slate-700 dark:text-slate-300" />
                            <SocialRow icon={Linkedin} label="LinkedIn" value={social.linkedin} onChange={v => setSocial(p => ({ ...p, linkedin: v }))} color="text-blue-700 dark:text-blue-400" />
                            <SocialRow icon={Twitter} label="Twitter / X" value={social.twitter} onChange={v => setSocial(p => ({ ...p, twitter: v }))} color="text-sky-500" />
                            <SocialRow icon={Facebook} label="Facebook" value={social.facebook} onChange={v => setSocial(p => ({ ...p, facebook: v }))} color="text-blue-600" />
                            <SocialRow icon={Instagram} label="Instagram" value={social.instagram} onChange={v => setSocial(p => ({ ...p, instagram: v }))} color="text-pink-500" />
                            <SocialRow icon={Youtube} label="YouTube" value={social.youtube} onChange={v => setSocial(p => ({ ...p, youtube: v }))} color="text-red-500" />
                            <SaveButton onClick={() => handleSave("social", social)} saving={saving} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── CONTACT ─────────────────────────────────────────── */}
                <TabsContent value="contact">
                    <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white"><Phone className="h-5 w-5 text-orange-500" /> Contact Settings</CardTitle>
                            <CardDescription>Contact details displayed on your site.</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-2 divide-y divide-slate-100 dark:divide-slate-800">
                            <FieldRow label="Contact Email">
                                <Input type="email" value={contact.contactEmail} onChange={e => setContact(p => ({ ...p, contactEmail: e.target.value }))} placeholder="hello@example.com" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="Phone Number">
                                <Input type="tel" value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="WhatsApp Number">
                                <Input type="tel" value={contact.whatsapp} onChange={e => setContact(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+91 9876543210" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="Office Address">
                                <Textarea value={contact.address} onChange={e => setContact(p => ({ ...p, address: e.target.value }))} rows={3} className="rounded-xl resize-none" />
                            </FieldRow>
                            <FieldRow label="Google Map Embed Link">
                                <Textarea value={contact.mapEmbedLink} onChange={e => setContact(p => ({ ...p, mapEmbedLink: e.target.value }))} rows={3} className="rounded-xl resize-none font-mono text-xs" placeholder="https://www.google.com/maps/embed?..." />
                            </FieldRow>
                            <SaveButton onClick={() => handleSave("contact", contact)} saving={saving} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── HOMEPAGE ────────────────────────────────────────── */}
                <TabsContent value="homepage">
                    <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white"><Home className="h-5 w-5 text-indigo-500" /> Homepage Settings</CardTitle>
                            <CardDescription>Configure the hero section of your homepage.</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-2 divide-y divide-slate-100 dark:divide-slate-800">
                            <FieldRow label="Hero Title" description="Main heading — your name or intro.">
                                <Input value={homepage.heroTitle} onChange={e => setHomepage(p => ({ ...p, heroTitle: e.target.value }))} placeholder="Hi, I'm John Doe 👋" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="Hero Subtitle" description="Your role or expertise.">
                                <Input value={homepage.heroSubtitle} onChange={e => setHomepage(p => ({ ...p, heroSubtitle: e.target.value }))} placeholder="Full-Stack Developer & Designer" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="Hero Description" description="Short bio.">
                                <Textarea value={homepage.heroDescription} onChange={e => setHomepage(p => ({ ...p, heroDescription: e.target.value }))} rows={4} className="rounded-xl resize-none" />
                            </FieldRow>
                            <FieldRow label="Hero Image">
                                <FileInput id="hero-image" label="Upload hero image" fieldKey="heroImageUrl" previewUrl={homepage.heroImageUrl} onUploaded={url => setHomepage(p => ({ ...p, heroImageUrl: url }))} />
                            </FieldRow>
                            <FieldRow label="Resume" description="Upload your latest resume (PDF).">
                                <FileInput id="resume-upload" label="Upload resume (PDF)" accept=".pdf,application/pdf" fieldKey="resumeUrl" previewUrl={homepage.resumeUrl} onUploaded={url => setHomepage(p => ({ ...p, resumeUrl: url }))} />
                            </FieldRow>
                            <FieldRow label="CTA Button Text">
                                <Input value={homepage.ctaText} onChange={e => setHomepage(p => ({ ...p, ctaText: e.target.value }))} placeholder="Hire Me" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="CTA Button Link">
                                <Input value={homepage.ctaLink} onChange={e => setHomepage(p => ({ ...p, ctaLink: e.target.value }))} placeholder="/contact" className="h-11 rounded-xl" />
                            </FieldRow>
                            <SaveButton onClick={() => handleSave("homepage", homepage)} saving={saving} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── THEME ───────────────────────────────────────────── */}
                <TabsContent value="theme">
                    <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white"><Palette className="h-5 w-5 text-pink-500" /> Theme Settings</CardTitle>
                            <CardDescription>Customise the look and feel of your portfolio.</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-2 divide-y divide-slate-100 dark:divide-slate-800">
                            <FieldRow label="Primary Color" description="Main accent color.">
                                <div className="flex items-center gap-4">
                                    <input type="color" value={theme.primaryColor} onChange={e => setTheme(p => ({ ...p, primaryColor: e.target.value }))}
                                        className="h-11 w-16 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer p-1 bg-white dark:bg-slate-900" />
                                    <Input value={theme.primaryColor} onChange={e => setTheme(p => ({ ...p, primaryColor: e.target.value }))} className="h-11 rounded-xl w-36 font-mono" />
                                    <div className="h-9 w-9 rounded-xl shadow-md border border-slate-200 dark:border-slate-700" style={{ background: theme.primaryColor }} />
                                </div>
                            </FieldRow>
                            <FieldRow label="Dark Mode" description="Default theme for the public site.">
                                <div className="flex items-center gap-3">
                                    <Switch id="dark-mode" checked={theme.darkMode} onCheckedChange={v => setTheme(p => ({ ...p, darkMode: v }))} className="data-[state=checked]:bg-purple-600" />
                                    <Label htmlFor="dark-mode" className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                                        {theme.darkMode ? "Dark Mode Enabled" : "Light Mode Enabled"}
                                    </Label>
                                </div>
                            </FieldRow>
                            <SaveButton onClick={() => handleSave("theme", theme)} saving={saving} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── SECURITY ────────────────────────────────────────── */}
                <TabsContent value="security">
                    <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white"><Shield className="h-5 w-5 text-red-500" /> Security</CardTitle>
                            <CardDescription>Update your admin password.</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-2 divide-y divide-slate-100 dark:divide-slate-800">
                            <FieldRow label="Current Password">
                                <Input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="New Password" description="At least 8 characters.">
                                <Input type="password" value={passwords.next} onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))} placeholder="••••••••" className="h-11 rounded-xl" />
                            </FieldRow>
                            <FieldRow label="Confirm Password">
                                <Input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" className="h-11 rounded-xl" />
                            </FieldRow>
                            <div className="pt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">⚠️ You will be logged out after changing your password.</p>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={() => {
                                    if (!passwords.next || passwords.next !== passwords.confirm) {
                                        toast.error("Passwords do not match"); return;
                                    }
                                    toast.success("Password change not wired yet — add to admin change-password API");
                                }} className="bg-red-600 hover:bg-red-700 text-white h-11 px-8 rounded-xl font-semibold gap-2">
                                    <Shield className="h-4 w-4" /> Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SettingsPage
