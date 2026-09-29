import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router"
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  CreditCard,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  GraduationCap,
  HelpCircle,
  House,
  Info,
  LayoutGrid,
  LifeBuoy,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"
import logo from "../assets/utp-logo.png"

type Section = {
  id: string
  day: number
  start: number
  end: number
  room: string
  teacher: string
  mode: string
  seats: number
}
type Course = {
  id: string
  code: string
  name: string
  cycle: number
  credits: number
  prereq: string
  status: "available" | "pending" | "passed"
  sections: Section[]
}
type Choice = {
  courseId: string
  sectionId: string
}
type Receipt = {
  code: string
  date: string
  choices: Choice[]
}
type Stored = {
  schemaVersion: number
  choices: Choice[]
  inventory: Record<string, number>
  receipt: Receipt | null
  raceDone: boolean
  editing: boolean
  periodClosed: boolean
  authenticated: boolean
  password: string
}
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const teachers = [
  "Mg. Claudia Salazar",
  "Ing. Luis Mendoza",
  "Mg. Patricia Rojas",
  "Dr. Carlos Paredes",
  "Ing. Andrea Vargas",
  "Mg. José Quispe",
]
const seeds: [string, string, string, number, number, string, Course["status"]][] =
  [
    [
      "ihm",
      "100000S24V",
      "Interacción Hombre-Máquina",
      6,
      3,
      "Ingeniería de Software",
      "available",
    ],
    [
      "bd",
      "100000S22B",
      "Base de Datos II",
      6,
      4,
      "Base de Datos I",
      "available",
    ],
    [
      "software",
      "100000S25S",
      "Ingeniería de Software II",
      6,
      4,
      "Ingeniería de Software I",
      "available",
    ],
    [
      "redes",
      "100000S23R",
      "Redes y Comunicaciones I",
      6,
      4,
      "Arquitectura de Computadoras",
      "available",
    ],
    [
      "estadistica",
      "100000M18E",
      "Estadística Inferencial",
      5,
      3,
      "Estadística Descriptiva",
      "available",
    ],
    [
      "operativos",
      "100000S21O",
      "Sistemas Operativos",
      5,
      3,
      "Arquitectura de Computadoras",
      "available",
    ],
    [
      "web",
      "100000S26W",
      "Desarrollo Web Integrado",
      6,
      4,
      "Programación Orientada a Objetos",
      "available",
    ],
    [
      "investigacion",
      "100000M24I",
      "Investigación de Operaciones",
      6,
      3,
      "Estadística Descriptiva",
      "available",
    ],
    [
      "etica",
      "100000H20E",
      "Ética Profesional",
      6,
      2,
      "Ciudadanía y Reflexión Ética",
      "available",
    ],
    [
      "seguridad",
      "100000S30G",
      "Seguridad Informática",
      7,
      4,
      "Redes y Comunicaciones I",
      "pending",
    ],
    [
      "ia",
      "100000S32A",
      "Inteligencia Artificial",
      7,
      4,
      "Estadística Inferencial",
      "pending",
    ],
    [
      "proyectos",
      "100000S31P",
      "Gestión de Proyectos de TI",
      7,
      3,
      "Ingeniería de Software II",
      "pending",
    ],
    [
      "algoritmos",
      "100000S10A",
      "Algoritmos y Estructuras de Datos",
      3,
      4,
      "Introducción a la Programación",
      "passed",
    ],
    [
      "poo",
      "100000S15P",
      "Programación Orientada a Objetos",
      4,
      4,
      "Algoritmos y Estructuras de Datos",
      "passed",
    ],
    [
      "bdi",
      "100000S16B",
      "Base de Datos I",
      4,
      4,
      "Programación Orientada a Objetos",
      "passed",
    ],
    [
      "arquitectura",
      "100000S17C",
      "Arquitectura de Computadoras",
      4,
      3,
      "Sistemas Digitales",
      "passed",
    ],
    [
      "softwarei",
      "100000S20I",
      "Ingeniería de Software I",
      5,
      4,
      "Programación Orientada a Objetos",
      "passed",
    ],
    [
      "calculo",
      "100000M10C",
      "Cálculo Aplicado a la Física",
      3,
      4,
      "Cálculo I",
      "passed",
    ],
  ]
const courses: Course[] = seeds.map(
  ([id, code, name, cycle, credits, prereq, status], index) => ({
    id,
    code,
    name,
    cycle,
    credits,
    prereq,
    status,
    sections: Array.from({ length: 3 }, (_, section) => ({
      id: `${id}-${section + 1}`,
      day: (index + section * 2) % 6,
      start: 8 + ((index + section) % 7) * 2,
      end: 10 + ((index + section) % 7) * 2,
      room:
        section === 2
          ? "Aula virtual"
          : `Lima Centro · A-${301 + index * 2 + section}`,
      teacher: teachers[(index + section) % teachers.length],
      mode: section === 2 ? "Virtual" : "Presencial",
      seats:
        index === 0 && section === 1
          ? 0
          : index === 1 && section === 0
            ? 3
            : index === 2 && section === 0
              ? 1
              : 12 + ((index * 3 + section * 7) % 24),
    })),
  }),
)
const initialChoices: Choice[] = [
  { courseId: "ihm", sectionId: "ihm-1" },
  { courseId: "bd", sectionId: "bd-1" },
  { courseId: "software", sectionId: "software-1" },
]
const courseById = (id: string) => courses.find((course) => course.id === id)!
const sectionByChoice = (choice: Choice) =>
  courseById(choice.courseId).sections.find(
    (section) => section.id === choice.sectionId,
  )!
const time = (hour: number) => `${String(hour).padStart(2, "0")}:00`
const schedule = (section: Section) =>
  `${days[section.day]} · ${time(section.start)} – ${time(section.end)}`
const sectionLabel = (section: Section) =>
  `Sección ${section.id.split("-")[1].padStart(2, "0")}`
const totalCredits = (choices: Choice[]) =>
  choices.reduce(
    (total, choice) => total + courseById(choice.courseId).credits,
    0,
  )
const MIN_CREDITS = 3
const MAX_CREDITS = 24
const CREDIT_RATE = 145
const INSTALLMENT_COUNT = 5
const PERIOD_START = "2026-07-27"
const PERIOD_END = "2026-08-25"
const PERIOD_END_LABEL = "25/08/2026"
const periodDate = (state: Stored) =>
  state.periodClosed ? "2026-08-26" : "2026-08-20"
const periodIsOpen = (state: Stored) =>
  periodDate(state) >= PERIOD_START && periodDate(state) <= PERIOD_END
const PERIOD_CLOSED_MESSAGE = `El periodo de matrícula finalizó el ${PERIOD_END_LABEL}. Ya no es posible modificar tu matrícula`
const money = (amount: number) =>
  `S/ ${amount.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const cycleCost = (choices: Choice[]) => totalCredits(choices) * CREDIT_RATE
const sectionCapacity = (section: Section, state: Stored) =>
  state.inventory[section.id] ?? section.seats
const availableSeats = (section: Section, state: Stored) =>
  Math.max(
    0,
    sectionCapacity(section, state) -
      state.choices.filter((choice) => choice.sectionId === section.id).length,
  )
function validateChoice(state: Stored, target: Course, section: Section) {
  if (!periodIsOpen(state)) return PERIOD_CLOSED_MESSAGE
  if (target.status === "pending")
    return `Prerrequisito pendiente: ${target.prereq}. Debes aprobar ese curso para matricularte.`
  if (target.status === "passed")
    return "Ya aprobaste este curso. Elige un curso pendiente de tu malla."
  const alreadyChosen = state.choices.some(
    (choice) => choice.sectionId === section.id,
  )
  if (
    sectionCapacity(section, state) === 0 ||
    (!alreadyChosen && availableSeats(section, state) === 0)
  )
    return "Sección sin vacantes. Elige otro horario disponible."
  const otherChoices = state.choices.filter(
    (choice) => choice.courseId !== target.id,
  )
  const collision = otherChoices.find((choice) => {
    const existing = sectionByChoice(choice)
    return (
      existing.day === section.day &&
      existing.start < section.end &&
      section.start < existing.end
    )
  })
  if (collision)
    return `Cruce de horario con ${courseById(collision.courseId).name}: ${schedule(sectionByChoice(collision))}. Elige otra sección.`
  const credits = totalCredits(otherChoices) + target.credits
  if (credits > MAX_CREDITS)
    return `Superarías el máximo de ${MAX_CREDITS} créditos (${credits} créditos). Quita un curso o elige uno de menor carga.`
  return ""
}
const defaultStored: Stored = {
  schemaVersion: 2,
  choices: initialChoices,
  inventory: {},
  receipt: null,
  raceDone: false,
  editing: true,
  periodClosed: false,
  authenticated: true,
  password: "Utp2026!",
}
function loadStored(): Stored {
  try {
    const saved = JSON.parse(localStorage.getItem("utp-portal-v1") || "null")
    if (
      saved &&
      Array.isArray(saved.choices) &&
      saved.choices.every((choice: Choice) =>
        courses.some(
          (course) =>
            course.id === choice.courseId &&
            course.sections.some((section) => section.id === choice.sectionId),
        ),
      )
    ) {
      const inventory: Record<string, number> = { ...saved.inventory }
      if (saved.schemaVersion !== 2 && saved.receipt) {
        for (const choice of saved.choices as Choice[]) {
          if (typeof inventory[choice.sectionId] === "number")
            inventory[choice.sectionId] += 1
        }
      }
      return {
        ...defaultStored,
        choices: saved.choices,
        inventory,
        receipt: saved.receipt || null,
        raceDone: !!saved.raceDone,
        editing: saved.schemaVersion === 2 ? !!saved.editing : !saved.receipt,
        periodClosed: !!saved.periodClosed,
        authenticated: saved.authenticated !== false,
        password:
          typeof saved.password === "string"
            ? saved.password
            : defaultStored.password,
      }
    }
  } catch {}
  return defaultStored
}
const navItems: {
  path: string
  label: string
  icon: LucideIcon
}[] = [
  { path: "/", label: "Inicio", icon: House },
  { path: "/matricula", label: "Matrícula", icon: BookOpen },
  { path: "/horario", label: "Mi horario", icon: CalendarDays },
  { path: "/malla", label: "Mi malla curricular", icon: LayoutGrid },
  { path: "/constancia", label: "Constancia de matrícula", icon: FileText },
  { path: "/pagos", label: "Pagos y cuotas", icon: CreditCard },
  { path: "/ayuda", label: "Ayuda y soporte", icon: LifeBuoy },
]
const btnStyles = {
  primary:
    "bg-primary text-white hover:bg-blue-800 border-transparent shadow-sm",
  secondary: "bg-white text-slate-600 border-border hover:bg-slate-50",
  ghost: "bg-transparent text-slate-600 border-transparent hover:bg-slate-100",
  danger: "bg-white text-red-700 border-red-200 hover:bg-red-50",
}
function Button({
  children,
  onClick,
  variant = "secondary",
  icon: Icon,
  disabled,
  className = "",
  type = "button",
}: {
  children: ReactNode
  onClick?: () => void
  variant?: keyof typeof btnStyles
  icon?: LucideIcon
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition-colors disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none ${btnStyles[variant]} ${className}`}
    >
      {Icon && <Icon size={16} strokeWidth={1.8} />}
      {children}
    </button>
  )
}
function Badge({
  children,
  tone = "neutral",
  icon: Icon = CircleCheck,
}: {
  children: ReactNode
  tone?: "success" | "warning" | "error" | "blue" | "neutral"
  icon?: LucideIcon
}) {
  const styles = {
    success: "bg-emerald-50 text-emerald-800",
    warning: "bg-amber-50 text-amber-800",
    error: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
    neutral: "bg-slate-100 text-slate-600",
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${styles[tone]}`}
    >
      <Icon size={12} />
      {children}
    </span>
  )
}
function Panel({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-xl border border-border bg-white ${className}`}
    >
      {children}
    </section>
  )
}
function Heading({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-[0.13em] text-slate-500 uppercase">
          {eyebrow}
        </p>
        <h1 className="text-[28px] leading-tight font-bold tracking-[-0.6px] md:text-[30px]">
          {title}
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  )
}
function Notice({
  children,
  tone = "blue",
  title,
}: {
  children: ReactNode
  tone?: "blue" | "warning" | "error" | "success"
  title?: string
}) {
  const classes = {
    blue: "border-blue-100 bg-blue-50/70 text-blue-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  }
  const Icon =
    tone === "success"
      ? CircleCheck
      : tone === "warning" || tone === "error"
        ? CircleAlert
        : Info
  return (
    <div
      className={`flex gap-3 rounded-lg border p-4 text-[12px] leading-relaxed ${classes[tone]}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div>
        {title && <p className="mb-1 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  )
}
function Modal({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby="dialog-title"
      className={`fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] overflow-auto rounded-2xl border border-border bg-white p-0 text-foreground shadow-2xl backdrop:bg-slate-950/40 ${
        wide ? "max-w-4xl" : "max-w-lg"
      }`}
    >
      <div className="flex items-start justify-between gap-5 border-b border-border p-6">
        <div>
          <h2 id="dialog-title" className="text-xl font-bold">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-[13px] text-slate-500">{subtitle}</p>
          )}
        </div>
        <button
          aria-label="Cerrar ventana"
          onClick={onClose}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100"
        >
          <X size={19} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  )
}
const eventColors = [
  "border-blue-200 bg-blue-50 text-blue-900",
  "border-violet-200 bg-violet-50 text-violet-900",
  "border-teal-200 bg-teal-50 text-teal-900",
  "border-orange-200 bg-orange-50 text-orange-900",
]
function WeeklySchedule({
  choices,
  compact = false,
}: {
  choices: Choice[]
  compact?: boolean
}) {
  return (
    <div className="overflow-x-auto">
      <div className={compact ? "min-w-[650px]" : "min-w-[760px]"}>
        <div className="grid grid-cols-[55px_repeat(6,minmax(0,1fr))] border-b border-border bg-slate-50/70">
          <div className="p-3 text-[10px] text-slate-400">HORA</div>
          {days.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-xs font-semibold text-slate-600"
            >
              {day}
            </div>
          ))}
        </div>
        {Array.from({ length: 7 }, (_, index) => 8 + index * 2).map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[55px_repeat(6,minmax(0,1fr))] border-b border-border last:border-b-0"
          >
            <div className="p-2 pt-3 text-[10px] text-slate-500">
              {time(hour)}
            </div>
            {days.map((_, day) => (
              <div
                key={day}
                className={`border-l border-border p-1.5 ${
                  compact ? "min-h-16" : "min-h-23"
                }`}
              >
                {choices
                  .filter((choice) => {
                    const section = sectionByChoice(choice)
                    return section.day === day && section.start === hour
                  })
                  .map((choice) => (
                    <div
                      key={choice.courseId}
                      className={`h-full rounded-md border p-2 ${eventColors[courses.findIndex((course) => course.id === choice.courseId) % 4]}`}
                    >
                      <p className="text-[10px] leading-snug font-semibold">
                        {courseById(choice.courseId).name}
                      </p>
                      <p className="mt-1 text-[9px]">
                        {time(hour)} – {time(sectionByChoice(choice).end)}
                      </p>
                      {!compact && (
                        <p className="mt-1 text-[9px]">
                          {sectionByChoice(choice).room}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
function downloadPdf(receipt: Receipt) {
  const lines = [
    "UNIVERSIDAD TECNOLOGICA DEL PERU",
    "CONSTANCIA DE MATRICULA - 2026-II",
    "Sebastian Ramirez Torres - U20210482",
    "Ingenieria de Sistemas e Informatica",
    "Sede Lima Centro",
    "",
    ...receipt.choices.flatMap((choice) => [
      courseById(choice.courseId).name,
      `${sectionLabel(sectionByChoice(choice))} | ${schedule(sectionByChoice(choice))}`,
      `${sectionByChoice(choice).room} | ${courseById(choice.courseId).credits} creditos | ${money(courseById(choice.courseId).credits * CREDIT_RATE)}`,
      "",
    ]),
    `Total: ${totalCredits(receipt.choices)} creditos`,
    `Tarifa por credito: ${money(CREDIT_RATE)}`,
    `Costo del ciclo: ${money(cycleCost(receipt.choices))}`,
    `5 cuotas pendientes de ${money(cycleCost(receipt.choices) / INSTALLMENT_COUNT)}`,
    `Operacion: ${receipt.code}`,
    `Fecha: ${receipt.date}`,
  ].map((line) =>
    line
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\x20-\x7e]/g, "-")
      .replace(/[\\()]/g, "\\$&"),
  )
  const stream = `BT /F1 11 Tf 48 790 Td 17 TL ${lines.map((line, index) => `${index ? "T* " : ""}(${line}) Tj`).join("\n")} ET`
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ]
  let pdf = "%PDF-1.4\n"
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }))
  const link = document.createElement("a")
  link.href = url
  link.download = `Constancia-${receipt.code}.pdf`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function Portal() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [stored, setStored] = useState<Stored>(loadStored)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [toast, setToast] = useState("")
  const [query, setQuery] = useState("")
  const [cycle, setCycle] = useState("all")
  const [creditFilter, setCreditFilter] = useState("all")
  const [availability, setAvailability] = useState("available")
  const [sort, setSort] = useState("cycle")
  const [activeCourse, setActiveCourse] = useState("ihm")
  const [changeCourse, setChangeCourse] = useState<string | null>(null)
  const [removeCourse, setRemoveCourse] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState(false)
  const [seatError, setSeatError] = useState<Choice | null>(null)
  const [actionError, setActionError] = useState("")
  const [busy, setBusy] = useState(false)
  const [authMode, setAuthMode] =
    useState<"login" | "recover" | "reset" | "done">("login")
  const [studentCode, setStudentCode] = useState("U20210482")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [authError, setAuthError] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [accessHelp, setAccessHelp] = useState(false)
  const [supportSent, setSupportSent] = useState(false)
  const [supportTopic, setSupportTopic] = useState("Matrícula y horarios")
  const [supportMessage, setSupportMessage] = useState("")
  const [supportError, setSupportError] = useState("")
  const choices = stored.choices
  const credits = totalCredits(choices)
  const completed = !!stored.receipt && !stored.editing
  const enrolledChoices = choices
  const periodOpen = periodIsOpen(stored)
  const totalCost = cycleCost(choices)
  const installment = totalCost / INSTALLMENT_COUNT
  const course = courseById(activeCourse)
  const current = navItems.find((item) =>
    item.path === "/" ? pathname === "/" : pathname.startsWith(item.path),
  )
  const sectionSeats = (section: Section) => availableSeats(section, stored)
  const invalidChoices = choices.filter(
    (choice) => sectionCapacity(sectionByChoice(choice), stored) <= 0,
  )
  const effectiveError =
    seatError &&
    choices.some((choice) => choice.sectionId === seatError.sectionId)
      ? seatError
      : null
  const step = pathname.includes("confirmacion")
    ? 4
    : pathname.includes("resumen")
      ? 3
      : pathname.includes("horarios")
        ? 2
        : 1
  const isEnrollment = pathname.startsWith("/matricula")
  useEffect(() => {
    localStorage.setItem("utp-portal-v1", JSON.stringify(stored))
  }, [stored])
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4500)
      return () => clearTimeout(timer)
    }
  }, [toast])
  useEffect(() => {
    setMobileMenu(false)
    setUserMenu(false)
    setNotifications(false)
    setActionError("")
    window.scrollTo({ top: 0 })
    document.title = `${current?.label || "Portal de Matrícula"} · UTP`
    document.documentElement.lang = "es-PE"
  }, [pathname])
  useEffect(() => {
    if (changeCourse || removeCourse || confirmModal) setActionError("")
  }, [changeCourse, removeCourse, confirmModal])
  function go(path: string) {
    navigate(path)
  }
  function conflict(target: Course, section: Section) {
    return choices.find((choice) => {
      if (choice.courseId === target.id) return false
      const existing = sectionByChoice(choice)
      return (
        existing.day === section.day &&
        existing.start < section.end &&
        section.start < existing.end
      )
    })
  }
  function eligibility(target: Course, section: Section) {
    if (busy) return "Espera a que termine la operación en curso."
    return validateChoice(stored, target, section)
  }
  function startEditing() {
    if (!periodOpen) {
      setActionError(PERIOD_CLOSED_MESSAGE)
      return
    }
    setStored((previous) => ({ ...previous, editing: true }))
    go("/matricula")
  }
  function addSection(target: Course, section: Section, fromModal = false) {
    const error = eligibility(target, section)
    if (error) {
      setActionError(error)
      return
    }
    if (choices.some((choice) => choice.sectionId === section.id)) return
    setStored((previous) =>
      validateChoice(previous, target, section)
        ? previous
        : {
            ...previous,
            editing: true,
            choices: [
              ...previous.choices.filter(
                (choice) => choice.courseId !== target.id,
              ),
              { courseId: target.id, sectionId: section.id },
            ],
          },
    )
    setActionError("")
    setToast(
      fromModal
        ? "Horario actualizado. Tu selección sigue guardada."
        : "Curso agregado a tu matrícula",
    )
    if (fromModal) {
      setChangeCourse(null)
      if (seatError?.courseId === target.id) setSeatError(null)
    }
  }
  function removeSelected() {
    if (!removeCourse) return
    if (!periodOpen || busy) {
      setActionError(
        !periodOpen
          ? PERIOD_CLOSED_MESSAGE
          : "Espera a que termine la operación en curso.",
      )
      return
    }
    setStored((previous) => ({
      ...previous,
      editing: true,
      choices: previous.choices.filter(
        (choice) => choice.courseId !== removeCourse,
      ),
    }))
    if (seatError?.courseId === removeCourse) setSeatError(null)
    setRemoveCourse(null)
    setToast("Curso quitado de tu selección. Puedes agregarlo nuevamente.")
  }
  function openSummary() {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      go("/matricula/resumen")
    }, 450)
  }
  function confirmEnrollment() {
    if (busy) return
    if (!periodOpen) {
      setActionError(PERIOD_CLOSED_MESSAGE)
      return
    }
    if (credits < MIN_CREDITS || credits > MAX_CREDITS) {
      setActionError(
        credits < MIN_CREDITS
          ? "Necesitas al menos 3 créditos para confirmar tu matrícula"
          : "Superas el máximo de 24 créditos. Quita un curso para confirmar tu matrícula.",
      )
      return
    }
    if (invalidChoices.length) {
      setConfirmModal(false)
      setSeatError(invalidChoices[0])
      return
    }
    const collision = choices.find((choice) =>
      conflict(courseById(choice.courseId), sectionByChoice(choice)),
    )
    if (collision) {
      setActionError(
        `Hay un cruce de horario en ${courseById(collision.courseId).name}. Cambia su sección para continuar.`,
      )
      return
    }
    const ineligible = choices.find(
      (choice) => courseById(choice.courseId).status !== "available",
    )
    if (ineligible) {
      setActionError(
        validateChoice(
          stored,
          courseById(ineligible.courseId),
          sectionByChoice(ineligible),
        ),
      )
      return
    }
    setBusy(true)
    setTimeout(() => {
      const racing = choices.find((choice) => choice.sectionId === "software-1")
      if (!stored.raceDone && racing) {
        setStored((previous) => ({
          ...previous,
          raceDone: true,
          inventory: { ...previous.inventory, "software-1": 0 },
        }))
        setSeatError(racing)
        setConfirmModal(false)
        setBusy(false)
        return
      }
      const receipt: Receipt = {
        code: `MAT-2026-${String(Date.now()).slice(-6)}`,
        date: new Date(`${periodDate(stored)}T12:00:00-05:00`).toLocaleString(
          "es-PE",
          {
            timeZone: "America/Lima",
            dateStyle: "long",
            timeStyle: "short",
          },
        ),
        choices: [...choices],
      }
      setStored((previous) => ({
        ...previous,
        receipt,
        editing: false,
      }))
      setBusy(false)
      setConfirmModal(false)
      setSeatError(null)
      go("/matricula/confirmacion")
    }, 1000)
  }
  function download() {
    if (stored.receipt && completed) {
      downloadPdf({ ...stored.receipt, choices })
      setToast("Tu constancia se ha descargado en formato PDF.")
    }
  }
  const selectedStatus = (target: Course) =>
    choices.some((choice) => choice.courseId === target.id)
      ? "Matriculado"
      : target.status === "available"
        ? "Disponible"
        : target.status === "passed"
          ? "Aprobado"
          : "Prerrequisito pendiente"

  function periodPanel() {
    return (
      <div className="mb-5">
        <Notice
          tone={periodOpen ? "blue" : "warning"}
          title={
            periodOpen
              ? `Matrícula abierta hasta el ${PERIOD_END_LABEL}`
              : PERIOD_CLOSED_MESSAGE
          }
        >
          <p>
            Periodo de matrícula: 27/07/2026 – {PERIOD_END_LABEL}.{" "}
            {periodOpen
              ? "Puedes agregar, cambiar sección o quitar cursos, incluso con una matrícula confirmada."
              : "Puedes consultar tu horario, pagos y constancia."}
          </p>
          <details className="mt-2">
            <summary className="min-h-11 cursor-pointer text-[11px] underline underline-offset-4">
              Fecha del portal
            </summary>
            <p className="mb-2 text-[11px]">
              Fecha de consulta:{" "}
              {stored.periodClosed ? "26/08/2026" : "20/08/2026"}
            </p>
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-[11px]">
              <input
                type="checkbox"
                checked={stored.periodClosed}
                onChange={(event) => {
                  const periodClosed = event.target.checked
                  setStored((previous) => ({
                    ...previous,
                    periodClosed,
                  }))
                }}
              />
              Usar fecha fuera del periodo de matrícula
            </label>
          </details>
        </Notice>
        {completed && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Badge tone="success">Matrícula confirmada</Badge>
            <Button disabled={!periodOpen} onClick={startEditing}>
              Modificar matrícula
            </Button>
            {!periodOpen && (
              <p className="text-[11px] text-amber-800">
                {PERIOD_CLOSED_MESSAGE}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
  function billingSummary() {
    return (
      <div className="mt-4 flex flex-wrap justify-between gap-3 rounded-lg bg-slate-50 p-4 text-xs">
        <div>
          <p className="text-slate-500">
            Costo total del ciclo · {credits} créditos × {money(CREDIT_RATE)}
          </p>
          <p className="mt-1.5 font-semibold">{money(totalCost)}</p>
        </div>
        <div>
          <p className="text-slate-500">5 cuotas pendientes</p>
          <p className="mt-1.5 font-semibold">{money(installment)} cada una</p>
        </div>
      </div>
    )
  }

  function selectionPanel() {
    return (
      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <BookOpen size={17} className="text-primary" />
            <h2 className="text-sm font-semibold">Mi selección</h2>
          </div>
          <span className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-xs font-semibold text-primary">
            {choices.length}
          </span>
        </div>
        <div className="divide-y divide-border px-5">
          {choices.length ? (
            choices.map((choice) => (
              <div key={choice.courseId} className="py-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs leading-relaxed font-semibold">
                    {courseById(choice.courseId).name}
                  </h3>
                  {
                    <button
                      aria-label={`Quitar ${courseById(choice.courseId).name}`}
                      onClick={() => setRemoveCourse(choice.courseId)}
                      disabled={!periodOpen || busy}
                      className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={15} />
                    </button>
                  }
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  {sectionLabel(sectionByChoice(choice))} ·{" "}
                  {courseById(choice.courseId).credits} créditos
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock3 size={12} />
                  {schedule(sectionByChoice(choice))}
                </p>
                {(!periodOpen || busy) && (
                  <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
                    {!periodOpen
                      ? PERIOD_CLOSED_MESSAGE
                      : "Espera a que termine la operación en curso."}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <BookOpen className="mx-auto mb-3 text-slate-300" />
              <p className="text-xs text-slate-500">
                Elige un curso para comenzar.
              </p>
            </div>
          )}
        </div>
        <div className="border-t border-border bg-slate-50/70 p-5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Total de créditos</span>
            <span className="font-bold">
              {credits} <span className="font-normal text-slate-400">/ 24</span>
            </span>
          </div>
          <div
            className="mt-3 grid grid-cols-24 gap-0.5"
            aria-label={`${credits} de 24 créditos`}
          >
            {Array.from({ length: 24 }, (_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-sm ${
                  index < credits ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <p className="mt-3 text-[10px] text-slate-500">
            {credits} de 24 créditos · mínimo 3
          </p>
          {!periodOpen && (
            <p className="mt-3 text-[10px] text-amber-800">
              {PERIOD_CLOSED_MESSAGE}
            </p>
          )}
          {credits >= 21 && (
            <p className="mt-3 flex gap-1.5 text-[11px] text-amber-800">
              <CircleAlert size={14} className="shrink-0" />
              Te acercas al límite de créditos.
            </p>
          )}
        </div>
      </Panel>
    )
  }
  function sectionTable(target: Course, modal = false) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-medium tracking-wide text-slate-500 uppercase">
            <tr>
              {[
                "Sección",
                "Día",
                "Hora",
                "Aula",
                "Docente",
                "Modalidad",
                "Vacantes",
                "Acción",
              ].map((label) => (
                <th key={label} className="px-4 py-3 font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {target.sections.map((section) => {
              const selected = choices.some(
                (choice) => choice.sectionId === section.id,
              )
              const seats = sectionSeats(section)
              const error = eligibility(target, section)
              const blocked = !!error || selected
              const collision = conflict(target, section)
              return (
                <tr
                  key={section.id}
                  className={`${
                    seats === 0 && !selected
                      ? "bg-slate-50/70 text-slate-400"
                      : selected
                        ? "bg-blue-50/30"
                        : "bg-white"
                  }`}
                >
                  <td className="px-4 py-5 font-semibold">
                    {sectionLabel(section)}
                  </td>
                  <td className="px-4 py-5">
                    <p className="font-medium">{days[section.day]}</p>
                  </td>
                  <td className="px-4 py-5">
                    <p className="whitespace-nowrap text-[11px] text-slate-500">
                      {time(section.start)} – {time(section.end)}
                    </p>
                  </td>
                  <td className="px-4 py-5">
                    <p>{section.room}</p>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-[11px] text-slate-500">
                      {section.teacher}
                    </p>
                  </td>
                  <td className="px-4 py-5">
                    <span className="flex items-center gap-1.5">
                      {section.mode === "Virtual" ? (
                        <Monitor size={13} />
                      ) : (
                        <MapPin size={13} />
                      )}
                      {section.mode}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <Badge
                      tone={
                        selected && sectionCapacity(section, stored) > 0
                          ? "success"
                          : seats === 0
                            ? "error"
                            : seats <= 5
                              ? "warning"
                              : "success"
                      }
                      icon={
                        selected && sectionCapacity(section, stored) > 0
                          ? Check
                          : seats <= 5
                            ? CircleAlert
                            : Users
                      }
                    >
                      {selected && sectionCapacity(section, stored) > 0
                        ? "Vacante en tu matrícula"
                        : seats === 0
                          ? "Sin vacantes"
                          : seats <= 5
                            ? `Últimas ${seats} vacantes`
                            : `${seats} vacantes`}
                    </Badge>
                    {selected && sectionCapacity(section, stored) > 0 && (
                      <p className="mt-1.5 text-[10px] text-slate-500">
                        {seats} vacantes libres
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-5">
                    <div className="min-w-28">
                      {selected ? (
                        <>
                          <span
                            className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg border px-3 font-semibold ${
                              sectionCapacity(section, stored) > 0
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-amber-200 bg-amber-50 text-amber-800"
                            }`}
                          >
                            {sectionCapacity(section, stored) > 0 ? (
                              <Check size={15} />
                            ) : (
                              <CircleAlert size={15} />
                            )}
                            {sectionCapacity(section, stored) > 0
                              ? "Agregado"
                              : "Revisar horario"}
                          </span>
                          {
                            <button
                              className="mt-1 min-h-11 w-full text-[11px] text-red-700 underline underline-offset-4"
                              disabled={!periodOpen || busy}
                              onClick={() => setRemoveCourse(target.id)}
                            >
                              Quitar
                            </button>
                          }
                        </>
                      ) : (
                        <Button
                          disabled={blocked}
                          variant={modal ? "secondary" : "primary"}
                          icon={Plus}
                          onClick={() => addSection(target, section, modal)}
                          className="w-full"
                        >
                          {modal ? "Elegir horario" : "Agregar"}
                        </Button>
                      )}
                      {!selected && error && (
                        <p
                          className={`mt-2 max-w-44 text-[10px] leading-relaxed ${
                            collision ? "text-amber-800" : "text-slate-500"
                          }`}
                        >
                          {seats === 0
                            ? "Sección sin vacantes"
                            : collision
                              ? `Cruce con ${courseById(collision.courseId).name}`
                              : error}
                        </p>
                      )}
                      {selected && !periodOpen && (
                        <p className="mt-2 max-w-44 text-[10px] leading-relaxed text-slate-500">
                          {PERIOD_CLOSED_MESSAGE}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
  function stepper() {
    return (
      <Panel className="mb-6 px-4 py-4 md:px-7 md:py-5">
        <ol className="flex items-center">
          {["Buscar cursos", "Elegir horario", "Resumen", "Confirmación"].map(
            (label, index) => (
              <li
                key={label}
                className="flex min-w-0 flex-1 items-center last:flex-none"
              >
                <button
                  onClick={() => {
                    if (index === 0) go("/matricula")
                    else if (index === 1) go("/matricula/horarios")
                    else if (index === 2) openSummary()
                    else if (index === 3 && completed)
                      go("/matricula/confirmacion")
                    else if (index === 3) openSummary()
                  }}
                  aria-current={step === index + 1 ? "step" : undefined}
                  className="flex min-h-11 items-center gap-2.5 text-xs disabled:cursor-default"
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      step === index + 1
                        ? "bg-primary text-white"
                        : step > index + 1
                          ? "bg-blue-50 text-primary"
                          : "border border-border text-slate-400"
                    }`}
                  >
                    {step > index + 1 ? <Check size={14} /> : index + 1}
                  </span>
                  <span
                    className={`hidden sm:block ${
                      step === index + 1
                        ? "font-semibold text-primary"
                        : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {index !== 3 && (
                  <div
                    className={`mx-3 h-px flex-1 md:mx-6 ${
                      step > index + 1 ? "bg-blue-200" : "bg-border"
                    }`}
                  />
                )}
              </li>
            ),
          )}
        </ol>
        <p className="mt-2 text-xs font-medium text-primary sm:hidden">
          {step}.{" "}
          {
            ["Buscar cursos", "Elegir horario", "Resumen", "Confirmación"][
              step - 1
            ]
          }
        </p>
      </Panel>
    )
  }

  function homePage() {
    return (
      <>
        <Heading
          eyebrow="Tu espacio académico"
          title="Hola, Sebastián"
          subtitle="Un nuevo ciclo, nuevas oportunidades. Organiza tu matrícula en un solo lugar."
        >
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays size={15} />
            Ciclo académico{" "}
            <strong className="font-semibold text-slate-700">2026-II</strong>
          </span>
        </Heading>
        <div className="grid gap-5 xl:grid-cols-[1fr_310px]">
          <Panel className="relative overflow-hidden p-6 md:p-8">
            <div className="absolute -top-10 -right-9 size-64 rounded-full border-[35px] border-blue-50/60" />
            <div className="absolute right-18 -bottom-20 size-44 rounded-full border-[25px] border-blue-50/80" />
            <div className="relative">
              <Badge
                tone={!periodOpen ? "warning" : completed ? "success" : "blue"}
                icon={
                  !periodOpen ? CircleAlert : completed ? CircleCheck : Sparkles
                }
              >
                {!periodOpen
                  ? "Periodo de matrícula finalizado"
                  : completed
                    ? "Matrícula registrada"
                    : `Matrícula abierta hasta el ${PERIOD_END_LABEL}`}
              </Badge>
              <h2 className="mt-5 max-w-sm text-[27px] leading-[1.3] font-bold tracking-[-0.5px]">
                {completed
                  ? "Todo listo para un nuevo ciclo."
                  : "Tu siguiente paso empieza aquí."}
              </h2>
              <p className="mt-3 max-w-md text-[13px] leading-6 text-slate-500">
                {!periodOpen
                  ? "Consulta tu horario, tus pagos y tu constancia. Las modificaciones ya no están disponibles."
                  : completed
                    ? "Tu matrícula se registró correctamente. Revisa tu horario y descarga tu constancia."
                    : "Elige tus cursos, encuentra el horario ideal y confirma tu matrícula de forma segura."}
              </p>
              <Button
                variant="primary"
                onClick={() => (completed ? startEditing() : go("/matricula"))}
                disabled={!periodOpen}
                className="mt-6"
              >
                {completed ? "Modificar matrícula" : "Continuar mi matrícula"}
                <ArrowRight size={16} />
              </Button>
              {!periodOpen && (
                <p className="mt-3 text-[11px] text-amber-800">
                  {PERIOD_CLOSED_MESSAGE}
                </p>
              )}
              <p className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500">
                <ShieldCheck size={13} />
                Tu selección se guarda automáticamente.
              </p>
            </div>
          </Panel>
          <Panel className="flex flex-col p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-600">
                Tu carga académica
              </h2>
              <GraduationCap size={18} className="text-slate-400" />
            </div>
            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-[-2px]">
                {credits}
              </span>
              <span className="mb-1 text-sm text-slate-400">/ 24 créditos</span>
            </div>
            <div className="mt-5 grid grid-cols-24 gap-1">
              {Array.from({ length: 24 }, (_, index) => (
                <div
                  key={index}
                  className={`h-7 rounded-sm ${
                    index < credits ? "bg-blue-600" : "bg-slate-100"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              {choices.length} cursos{" "}
              {completed ? "matriculados" : "en tu selección"}
            </p>
            <div className="mt-4 text-[11px]">
              <p className="text-slate-500">Costo total del ciclo</p>
              <p className="mt-1 font-semibold">{money(totalCost)}</p>
              <p className="mt-1 text-slate-500">
                5 cuotas pendientes de {money(installment)}
              </p>
            </div>
            <div className="mt-auto pt-6">
              <div className="flex items-center gap-2 border-t border-border pt-4 text-[11px] text-slate-500">
                <Info size={14} />
                {credits < MIN_CREDITS
                  ? `Agrega ${MIN_CREDITS - credits} crédito(s) para cumplir el mínimo.`
                  : "Tu carga cumple el mínimo de 3 créditos."}
              </div>
            </div>
          </Panel>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: CalendarDays,
              title: "Inicio de clases",
              value: "24 de agosto",
              sub: "Prepárate para tu nuevo ciclo",
            },
            {
              icon: Clock3,
              title: "Cierre de matrícula",
              value: "25 de agosto",
              sub: "Hasta las 23:59 h",
            },
            {
              icon: MapPin,
              title: "Tu sede",
              value: "Lima Centro",
              sub: "Ingeniería de Sistemas e Informática",
            },
          ].map((item) => (
            <Panel key={item.title} className="flex items-start gap-4 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <item.icon size={19} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500">{item.title}</p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
                <p className="mt-1.5 text-[10px] text-slate-500">{item.sub}</p>
              </div>
            </Panel>
          ))}
        </div>
        <div className="mt-7 grid items-start gap-5 xl:grid-cols-[1fr_310px]">
          <Panel>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
              <div>
                <h2 className="text-sm font-semibold">
                  {completed
                    ? "Tus cursos matriculados"
                    : "Tu selección de cursos"}
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  {choices.length} cursos · {credits} créditos para este ciclo
                </p>
              </div>
              <button
                onClick={() =>
                  go(
                    completed
                      ? "/matricula/confirmacion"
                      : "/matricula/resumen",
                  )
                }
                className="flex min-h-11 items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-primary"
              >
                Ver {completed ? "matrícula" : "resumen"}
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-border">
              {choices.map((choice, index) => (
                <div
                  key={choice.courseId}
                  className="flex items-center gap-3 p-5"
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${eventColors[index % 4]}`}
                  >
                    <BookOpen size={17} strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">
                      {courseById(choice.courseId).name}
                    </p>
                    <p className="mt-1.5 text-[10px] text-slate-500">
                      {sectionLabel(sectionByChoice(choice))}{" "}
                      <span className="mx-1">·</span>
                      {schedule(sectionByChoice(choice))}
                    </p>
                  </div>
                  <span className="hidden text-xs font-medium text-slate-500 sm:block">
                    {courseById(choice.courseId).credits} cr.
                  </span>
                  <button
                    aria-label={`Ver horario de ${courseById(choice.courseId).name}`}
                    onClick={() => {
                      setActiveCourse(choice.courseId)
                      go(completed ? "/horario" : "/matricula/horarios")
                    }}
                    className="flex size-11 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
            {!choices.length && (
              <p className="p-8 text-sm text-slate-500">
                Tu selección está vacía. Explora los cursos de tu malla.
              </p>
            )}
            <div className="flex items-center gap-2 rounded-b-xl border-t border-border bg-slate-50/60 px-5 py-3 text-[10px] text-slate-500">
              <CheckCheck size={14} className="text-emerald-700" />
              {completed
                ? "Matrícula registrada correctamente"
                : "Selección guardada · Puedes cambiarla cuando lo necesites"}
            </div>
          </Panel>
          <Panel className="p-5">
            <div className="flex items-center gap-2">
              <CircleCheck size={17} className="text-emerald-700" />
              <h2 className="text-sm font-semibold">Todo en orden</h2>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              Revisamos los requisitos para que puedas continuar sin
              inconvenientes.
            </p>
            <div className="mt-5 space-y-5">
              {[
                "Derecho de matrícula pagado",
                "Datos personales actualizados",
                "Prerrequisitos verificados",
              ].map((label) => (
                <div
                  key={label}
                  className="flex gap-2.5 text-[11px] text-slate-600"
                >
                  <Check size={15} className="shrink-0 text-emerald-700" />
                  {label}
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-4">
              <button
                onClick={() => go("/ayuda")}
                className="flex min-h-11 items-center gap-2 text-[11px] font-medium text-slate-600"
              >
                <HelpCircle size={15} />
                ¿Necesitas orientación?
                <ArrowRight size={13} />
              </button>
            </div>
          </Panel>
        </div>
        <div className="mt-6 flex items-center gap-2 px-1 text-[11px] text-slate-500">
          <Info size={14} />
          <span>
            Las vacantes y los montos se actualizan con cada cambio. Confirma tu
            matrícula para emitir la constancia.
          </span>
        </div>
      </>
    )
  }

  function coursesPage() {
    const normalized = query
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
    const filtered = courses
      .filter(
        (target) =>
          `${target.name} ${target.code}`
            .toLocaleLowerCase("es")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(normalized) &&
          (cycle === "all" || target.cycle === Number(cycle)) &&
          (creditFilter === "all" || target.credits === Number(creditFilter)) &&
          (availability === "all" || target.status === "available"),
      )
      .sort((first, second) =>
        sort === "name"
          ? first.name.localeCompare(second.name)
          : sort === "credits"
            ? second.credits - first.credits
            : first.cycle - second.cycle,
      )
    return (
      <>
        <Heading
          eyebrow="Matrícula · 2026-II"
          title="Elige tus cursos"
          subtitle="Encuentra los cursos de tu malla y arma un horario que se adapte a ti."
        >
          <Badge tone="blue" icon={GraduationCap}>
            Ciclo 6 · Ingeniería de Sistemas
          </Badge>
        </Heading>
        <div className="grid items-start gap-5 xl:grid-cols-[1fr_290px]">
          <div>
            <Panel>
              <div className="p-5">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute top-3.5 left-3.5 text-slate-400"
                  />
                  <input
                    aria-label="Buscar cursos por nombre o código"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Busca por nombre o código del curso"
                    className="h-11 w-full rounded-lg border border-border bg-white pr-4 pl-11 text-xs placeholder:text-slate-400"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <SlidersHorizontal
                    size={15}
                    className="mr-1 text-slate-400"
                  />
                  <select
                    aria-label="Filtrar por ciclo"
                    value={cycle}
                    onChange={(event) => setCycle(event.target.value)}
                    className="min-h-11 rounded-lg border border-border px-3 text-[11px] text-slate-600"
                  >
                    <option value="all">Todos los ciclos</option>
                    {[3, 4, 5, 6, 7].map((value) => (
                      <option key={value} value={value}>
                        Ciclo {value}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Filtrar por créditos"
                    value={creditFilter}
                    onChange={(event) => setCreditFilter(event.target.value)}
                    className="min-h-11 rounded-lg border border-border px-3 text-[11px] text-slate-600"
                  >
                    <option value="all">Todos los créditos</option>
                    {[2, 3, 4].map((value) => (
                      <option key={value} value={value}>
                        {value} créditos
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Filtrar por disponibilidad"
                    value={availability}
                    onChange={(event) => setAvailability(event.target.value)}
                    className="min-h-11 rounded-lg border border-border px-3 text-[11px] text-slate-600"
                  >
                    <option value="available">Disponibles</option>
                    <option value="all">Todos los cursos</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between border-y border-border bg-slate-50/60 px-5 py-2">
                <p className="text-[11px] text-slate-500">
                  {filtered.length} cursos encontrados
                </p>
                <select
                  aria-label="Ordenar cursos"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="min-h-11 bg-transparent text-[11px] text-slate-600"
                >
                  <option value="cycle">Ordenar por ciclo</option>
                  <option value="name">Nombre: A – Z</option>
                  <option value="credits">Mayor número de créditos</option>
                </select>
              </div>
              <div className="divide-y divide-border">
                {filtered.map((target) => (
                  <div
                    key={target.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:bg-slate-50/50"
                  >
                    <div className="flex min-w-0 flex-1 gap-3">
                      <div className="hidden size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-slate-50 text-slate-500 sm:flex">
                        <BookOpen size={18} strokeWidth={1.6} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-[13px] font-semibold">
                            {target.name}
                          </h2>
                        </div>
                        <p className="mt-1.5 text-[10px] text-slate-500">
                          {target.code}{" "}
                          <span className="mx-1.5 text-slate-300">|</span>Ciclo{" "}
                          {target.cycle}
                          <span className="mx-1.5 text-slate-300">|</span>
                          {target.credits} créditos
                        </p>
                        <p className="mt-2 text-[10px] text-slate-500">
                          Prerrequisito: {target.prereq}
                          {target.status !== "pending" && (
                            <Check
                              size={11}
                              className="ml-1 inline text-emerald-700"
                            />
                          )}
                        </p>
                        <div className="mt-2.5">
                          <Badge
                            tone={
                              selectedStatus(target) === "Matriculado"
                                ? "blue"
                                : target.status === "available"
                                  ? "success"
                                  : target.status === "pending"
                                    ? "warning"
                                    : "neutral"
                            }
                            icon={
                              target.status === "pending"
                                ? LockKeyhole
                                : CircleCheck
                            }
                          >
                            {selectedStatus(target)}
                          </Badge>
                          {choices.some(
                            (choice) => choice.courseId === target.id,
                          ) && (
                            <span className="ml-2 text-[11px] text-slate-500">
                              {sectionLabel(
                                sectionByChoice(
                                  choices.find(
                                    (choice) => choice.courseId === target.id,
                                  )!,
                                ),
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {choices.some(
                        (choice) => choice.courseId === target.id,
                      ) ? (
                        <>
                          <Button
                            variant="danger"
                            icon={Trash2}
                            disabled={!periodOpen || busy}
                            onClick={() => setRemoveCourse(target.id)}
                            className="text-[11px]"
                          >
                            Quitar curso
                          </Button>
                          <button
                            disabled={!periodOpen || busy}
                            onClick={() => {
                              setActiveCourse(target.id)
                              go("/matricula/horarios")
                            }}
                            className="min-h-11 text-[11px] text-slate-600 underline underline-offset-4 disabled:text-slate-500"
                          >
                            Cambiar sección
                          </button>
                        </>
                      ) : (
                        <Button
                          disabled={
                            target.status !== "available" || !periodOpen || busy
                          }
                          onClick={() => {
                            setActiveCourse(target.id)
                            go("/matricula/horarios")
                          }}
                          className="text-[11px]"
                        >
                          Ver horarios
                          <ChevronRight size={14} />
                        </Button>
                      )}
                      {(!periodOpen ||
                        target.status !== "available" ||
                        busy) && (
                        <p className="max-w-52 text-[10px] leading-relaxed text-slate-500">
                          {!periodOpen
                            ? PERIOD_CLOSED_MESSAGE
                            : busy
                              ? "Espera a que termine la operación en curso."
                              : target.status === "pending"
                                ? `Requiere aprobar ${target.prereq}.`
                                : "Este curso ya está aprobado."}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="p-12 text-center">
                    <Search size={30} className="mx-auto mb-4 text-slate-300" />
                    <h2 className="text-sm font-semibold">
                      No se encontraron cursos
                    </h2>
                    <p className="mt-2 text-xs text-slate-500">
                      Prueba con otro término o cambia tus filtros.
                    </p>
                    <Button
                      className="mt-5"
                      onClick={() => {
                        setQuery("")
                        setCycle("all")
                        setCreditFilter("all")
                        setAvailability("available")
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                )}
              </div>
            </Panel>
          </div>
          <aside className="space-y-4 xl:sticky xl:top-25">
            {selectionPanel()}
            <Notice>
              {!periodOpen
                ? "Puedes consultar tus cursos y montos. El periodo de matrícula ya finalizó."
                : completed
                  ? "Tu matrícula está confirmada. Puedes modificarla durante el periodo vigente y confirmar los cambios."
                  : "Los cambios actualizan tus vacantes y montos. Confirma tu matrícula para emitir la constancia."}
            </Notice>
          </aside>
        </div>
      </>
    )
  }
  function sectionsPage() {
    return (
      <>
        <Heading
          eyebrow="Matrícula · 2026-II"
          title="Encuentra tu horario"
          subtitle="Revisa las secciones, docentes y vacantes disponibles para este curso."
        />
        {stepper()}
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="text-[10px] text-slate-500">
                {course.code} · Ciclo {course.cycle}
              </p>
              <h2 className="mt-2 text-xl font-bold">{course.name}</h2>
              <p className="mt-2 text-xs text-slate-500">
                {course.credits} créditos · Prerrequisito: {course.prereq}
              </p>
            </div>
            <Badge tone="success">Prerrequisito cumplido</Badge>
          </div>
          {sectionTable(course)}
        </Panel>
        {actionError && (
          <div className="mt-4">
            <Notice tone="error">{actionError}</Notice>
          </div>
        )}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Notice>
            Las secciones sin vacantes no se pueden elegir. Si hay un cruce de
            horario, te indicaremos con qué curso.
          </Notice>
          <Notice tone={credits >= 21 ? "warning" : "blue"}>
            Mi selección:{" "}
            <strong>
              {choices.length} cursos · {credits} créditos
            </strong>
            . {credits} de 24 créditos · mínimo 3.
          </Notice>
        </div>
        <div className="mt-6">
          <Button icon={ArrowLeft} onClick={() => go("/matricula")}>
            Volver a cursos
          </Button>
        </div>
      </>
    )
  }
  function summaryPage() {
    return (
      <>
        <Heading
          eyebrow="Matrícula · 2026-II"
          title="Revisa tu matrícula"
          subtitle="Todo en un solo lugar. Puedes cambiar un horario o quitar un curso sin perder tu selección."
        />
        {stepper()}
        {effectiveError && (
          <div className="mb-5">
            <Notice tone="error" title="No pudimos confirmar tu matrícula.">
              La {sectionLabel(sectionByChoice(effectiveError)).toLowerCase()} (
              {schedule(sectionByChoice(effectiveError))}) de{" "}
              <strong>{courseById(effectiveError.courseId).name}</strong> se
              llenó mientras revisabas. Tus demás cursos siguen en tu selección.
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  onClick={() => setChangeCourse(effectiveError.courseId)}
                >
                  Elegir otro horario
                </Button>
                <Button onClick={() => setSeatError(null)}>
                  Volver al resumen
                </Button>
              </div>
              <details className="mt-3">
                <summary className="min-h-11 cursor-pointer text-[11px] underline underline-offset-4">
                  Detalles técnicos
                </summary>
                <p className="rounded-lg bg-white/60 p-3 text-[11px]">
                  Validación de cupo: disponibilidad agotada al registrar la
                  sección. Referencia de soporte: MAT-CUPO-409. La operación no
                  registró ningún curso.
                </p>
              </details>
            </Notice>
          </div>
        )}
        {!effectiveError && invalidChoices.length > 0 && (
          <div className="mb-5">
            <Notice tone="warning" title="Una sección ya no tiene vacantes">
              Revalidamos tu selección y encontramos una sección llena. Cambia
              el horario señalado para continuar.
            </Notice>
          </div>
        )}
        <Panel className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold">Cursos seleccionados</h2>
            <Badge
              tone={invalidChoices.length ? "warning" : "success"}
              icon={invalidChoices.length ? CircleAlert : ShieldCheck}
            >
              {invalidChoices.length
                ? "Requiere revisión"
                : "Horarios sin cruces"}
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] tracking-wide text-slate-500 uppercase">
                <tr>
                  {[
                    "Curso",
                    "Sección elegida",
                    "Día y hora",
                    "Aula",
                    "Docente",
                    "Créditos",
                    "Acciones",
                  ].map((label) => (
                    <th className="px-5 py-3 font-medium" key={label}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {choices.map((choice) => {
                  const target = courseById(choice.courseId)
                  const section = sectionByChoice(choice)
                  const invalid = sectionCapacity(section, stored) === 0
                  return (
                    <tr
                      key={choice.courseId}
                      className={invalid ? "bg-amber-50/50" : ""}
                    >
                      <td className="max-w-55 px-5 py-5">
                        <p className="font-semibold">{target.name}</p>
                        <p className="mt-1.5 text-[10px] text-slate-500">
                          {target.code}
                        </p>
                        {invalid && (
                          <div className="mt-2">
                            <Badge tone="warning" icon={CircleAlert}>
                              Sección sin vacantes
                            </Badge>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-5">
                        <p className="font-medium">{sectionLabel(section)}</p>
                      </td>
                      <td className="px-5 py-5">
                        <p className="text-[11px] text-slate-500">
                          {schedule(section)}
                        </p>
                      </td>
                      <td className="px-5 py-5">
                        <p>{section.room}</p>
                      </td>
                      <td className="px-5 py-5">
                        <p className="text-[11px] text-slate-500">
                          {section.teacher}
                        </p>
                      </td>
                      <td className="px-5 py-5 font-semibold">
                        {target.credits}
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-1">
                          <Button
                            disabled={!periodOpen || busy}
                            className="text-[11px]"
                            onClick={() => setChangeCourse(target.id)}
                          >
                            Cambiar horario
                          </Button>
                          <button
                            disabled={!periodOpen || busy}
                            onClick={() => setRemoveCourse(target.id)}
                            className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg text-[11px] text-red-700 hover:bg-red-50 disabled:text-slate-400"
                          >
                            <Trash2 size={12} />
                            Quitar curso
                          </button>
                          {!periodOpen && (
                            <p className="max-w-44 text-[10px] leading-relaxed text-slate-500">
                              {PERIOD_CLOSED_MESSAGE}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {!choices.length && (
            <div className="p-10 text-center">
              <BookOpen className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm">Tu selección está vacía.</p>
              <Button onClick={() => go("/matricula")} className="mt-4">
                Buscar cursos
              </Button>
            </div>
          )}
          <div className="flex justify-between border-t border-border bg-slate-50 px-6 py-4 text-sm">
            <span className="text-slate-500">
              {choices.length} cursos seleccionados
            </span>
            <strong>Total: {credits} créditos</strong>
          </div>
        </Panel>
        {billingSummary()}
        <div className="mt-5">
          {credits > MAX_CREDITS ? (
            <Notice tone="warning">
              Superas el máximo de 24 créditos. Quita un curso para confirmar tu
              matrícula.
            </Notice>
          ) : credits < MIN_CREDITS ? (
            <Notice tone="warning" title="Completa tu carga académica">
              Necesitas al menos 3 créditos para confirmar tu matrícula. Has
              elegido {credits} créditos. Agrega un curso desde el listado.
            </Notice>
          ) : (
            <Notice tone="success">
              Tu carga de {credits} créditos cumple los requisitos del ciclo.
              Verificaremos las vacantes al registrar tu matrícula.
            </Notice>
          )}
        </div>
        <Panel className="mt-6 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border p-5">
            <CalendarDays size={17} className="text-slate-500" />
            <h2 className="text-sm font-semibold">
              Vista previa de tu horario
            </h2>
            <span className="ml-auto text-[10px] text-slate-500">2026-II</span>
          </div>
          <WeeklySchedule choices={choices} compact />
        </Panel>
        <div className="mt-5">
          <Button onClick={() => go("/matricula")} icon={ArrowLeft}>
            Volver a cursos
          </Button>
        </div>
      </>
    )
  }
  function successPage() {
    const receipt = stored.receipt
    if (!receipt || stored.editing)
      return (
        <>
          <Heading
            eyebrow="Matrícula"
            title={
              receipt
                ? "Confirma los cambios de tu matrícula"
                : "Tu matrícula sigue en preparación"
            }
            subtitle="Revisa tus cursos y confirma tu selección para obtener tu constancia."
          />
          {billingSummary()}
          <Button variant="primary" onClick={() => go("/matricula/resumen")}>
            Ir al resumen
          </Button>
        </>
      )
    return (
      <>
        <div className="mx-auto max-w-3xl">
          {stepper()}
          <Panel className="overflow-hidden">
            <div className="border-b border-border p-8 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <CheckCheck size={30} />
              </div>
              <Badge tone="success">Matrícula registrada</Badge>
              <h1 className="mt-5 text-3xl font-bold">
                ¡Ya eres parte del nuevo ciclo!
              </h1>
              <p className="mt-3 text-sm text-slate-500">
                Tu matrícula del ciclo 2026-II se registró correctamente.
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6 grid gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] text-slate-500">
                    Código de operación
                  </p>
                  <p className="mt-1 text-xs font-semibold">{receipt.code}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Fecha y hora</p>
                  <p className="mt-1 text-xs font-semibold">{receipt.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Carga académica</p>
                  <p className="mt-1 text-xs font-semibold">
                    {receipt.choices.length} cursos ·{" "}
                    {totalCredits(receipt.choices)} créditos
                  </p>
                </div>
              </div>
              {billingSummary()}
              <h2 className="mb-2 text-sm font-semibold">
                Tus cursos matriculados
              </h2>
              <div className="divide-y divide-border">
                {receipt.choices.map((choice) => (
                  <div key={choice.courseId} className="flex gap-3 py-4">
                    <CircleCheck
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        {courseById(choice.courseId).name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {sectionLabel(sectionByChoice(choice))} ·{" "}
                        {schedule(sectionByChoice(choice))}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {sectionByChoice(choice).room}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  variant="primary"
                  icon={ArrowDownToLine}
                  onClick={download}
                >
                  Descargar constancia
                </Button>
                <Button icon={CalendarDays} onClick={() => go("/horario")}>
                  Ver mi horario
                </Button>
                <Button onClick={() => go("/")}>Ir al inicio</Button>
                <Button disabled={!periodOpen} onClick={startEditing}>
                  Modificar matrícula
                </Button>
              </div>
              {!periodOpen && (
                <p className="mt-3 text-center text-[11px] text-amber-800">
                  {PERIOD_CLOSED_MESSAGE}
                </p>
              )}
            </div>
          </Panel>
        </div>
      </>
    )
  }

  function schedulePage() {
    return (
      <>
        <Heading
          eyebrow="Organiza tu semana"
          title="Mi horario"
          subtitle={
            completed
              ? "Tu horario de clases para el ciclo 2026-II."
              : "Vista previa de tu selección. Confirma tu matrícula para registrar estos horarios."
          }
        >
          <Button
            icon={completed ? ArrowDownToLine : BookOpen}
            variant="primary"
            onClick={() => (completed ? download() : go("/matricula/resumen"))}
          >
            {completed ? "Descargar constancia" : "Revisar matrícula"}
          </Button>
        </Heading>
        {!completed && (
          <div className="mb-5">
            <Notice>
              Este horario corresponde a tus cursos seleccionados. La matrícula
              aún no está registrada.
            </Notice>
          </div>
        )}
        <Panel className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-primary" />
              <h2 className="text-sm font-semibold">Horario semanal</h2>
            </div>
            <span className="text-xs text-slate-500">
              {choices.length} cursos · {credits} créditos
            </span>
          </div>
          <WeeklySchedule choices={completed ? enrolledChoices : choices} />
        </Panel>
        <div className="mt-5 flex flex-wrap gap-4">
          {choices.map((choice, index) => (
            <span
              key={choice.courseId}
              className="flex items-center gap-2 text-[11px] text-slate-600"
            >
              <span
                className={`size-3 rounded-sm border ${eventColors[index % 4]}`}
              />
              {courseById(choice.courseId).name}
            </span>
          ))}
        </div>
      </>
    )
  }
  function curriculumPage() {
    const [passedCredits, allCredits] = [108, 200]
    return (
      <>
        <Heading
          eyebrow="Tu recorrido académico"
          title="Mi malla curricular"
          subtitle="Ingeniería de Sistemas e Informática · Plan de estudios 2022"
        />
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Panel className="p-5">
            <p className="text-xs text-slate-500">Créditos aprobados</p>
            <p className="mt-3 text-3xl font-bold">
              {passedCredits}
              <span className="text-sm font-normal text-slate-400">
                {" "}
                / {allCredits}
              </span>
            </p>
            <p className="mt-2 text-[11px] text-emerald-800">
              54 % de tu carrera completada
            </p>
          </Panel>
          <Panel className="p-5">
            <p className="text-xs text-slate-500">
              {completed ? "Créditos en curso" : "Créditos seleccionados"}
            </p>
            <p className="mt-3 text-3xl font-bold">{credits}</p>
            <p className="mt-2 text-[11px] text-slate-500">
              {choices.length} cursos · Ciclo 2026-II
            </p>
          </Panel>
          <Panel className="p-5">
            <p className="text-xs text-slate-500">Tu avance</p>
            <div className="mt-4 grid grid-cols-10 gap-1">
              {Array.from({ length: 10 }, (_, index) => (
                <div
                  key={index}
                  className={`h-6 rounded-sm ${
                    index < 5
                      ? "bg-emerald-600"
                      : index === 5
                        ? "bg-blue-600"
                        : "bg-slate-100"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Cursando el ciclo 6 de 10
            </p>
          </Panel>
        </div>
        <div className="mb-5 flex flex-wrap gap-3">
          <Badge tone="success">Aprobado</Badge>
          <Badge tone="blue" icon={Clock3}>
            {completed ? "En curso" : "En selección"}
          </Badge>
          <Badge tone="neutral" icon={BookOpen}>
            Pendiente
          </Badge>
          <Badge tone="warning" icon={LockKeyhole}>
            Prerrequisito pendiente
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[3, 4, 5, 6, 7].map((value) => (
            <Panel key={value} className="overflow-hidden">
              <div className="flex justify-between border-b border-border bg-slate-50 p-4">
                <h2 className="text-sm font-semibold">Ciclo {value}</h2>
                <span className="text-[11px] text-slate-500">
                  {courses.filter((target) => target.cycle === value).length}{" "}
                  cursos
                </span>
              </div>
              <div className="divide-y divide-border">
                {courses
                  .filter((target) => target.cycle === value)
                  .map((target) => (
                    <div key={target.id} className="p-4">
                      <p className="text-xs font-semibold">{target.name}</p>
                      <p className="mt-1.5 text-[10px] text-slate-500">
                        {target.code} · {target.credits} créditos
                      </p>
                      <div className="mt-3">
                        <Badge
                          tone={
                            target.status === "passed"
                              ? "success"
                              : choices.some(
                                    (choice) => choice.courseId === target.id,
                                  )
                                ? "blue"
                                : target.status === "pending"
                                  ? "warning"
                                  : "neutral"
                          }
                          icon={
                            target.status === "pending"
                              ? LockKeyhole
                              : target.status === "passed"
                                ? CircleCheck
                                : BookOpen
                          }
                        >
                          {target.status === "passed"
                            ? "Aprobado"
                            : choices.some(
                                  (choice) => choice.courseId === target.id,
                                )
                              ? completed
                                ? "En curso"
                                : "En selección"
                              : target.status === "pending"
                                ? "Prerrequisito pendiente"
                                : "Pendiente"}
                        </Badge>
                      </div>
                      {target.status === "pending" && (
                        <p className="mt-2 text-[10px] leading-4 text-slate-500">
                          Requiere aprobar: {target.prereq}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </Panel>
          ))}
        </div>
        <p className="mt-5 text-[11px] text-slate-500">
          Se muestran los cursos de tu tramo académico actual. Los 108 créditos
          aprobados incluyen los ciclos 1 y 2 y los cursos generales.
        </p>
      </>
    )
  }
  function certificatePage() {
    return (
      <>
        <Heading
          eyebrow="Documentos académicos"
          title="Constancia de matrícula"
          subtitle="Consulta y descarga el documento de tu matrícula vigente."
        >
          <Button
            disabled={!completed}
            variant="primary"
            icon={ArrowDownToLine}
            onClick={download}
          >
            Descargar PDF
          </Button>
        </Heading>
        {!completed && (
          <div className="my-5">
            <Notice
              title={
                stored.receipt
                  ? "Cambios pendientes de confirmación"
                  : "Matrícula en preparación"
              }
            >
              {periodOpen
                ? "Confirma tu matrícula para descargar una constancia actualizada."
                : PERIOD_CLOSED_MESSAGE}
              La vista previa y los montos reflejan tus cursos actuales.
            </Notice>
          </div>
        )}
        {!choices.length ? (
          <Panel className="p-12 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-slate-50">
              <FileText size={28} className="text-slate-400" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">
              Tu constancia aún no está disponible
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              No tienes cursos matriculados.{" "}
              {periodOpen
                ? "Elige tus cursos y confirma la matrícula para generar tu constancia del ciclo 2026-II."
                : PERIOD_CLOSED_MESSAGE}
            </p>
            <Button className="mt-6" onClick={() => go("/matricula/resumen")}>
              Ir a mi matrícula
              <ArrowRight size={15} />
            </Button>
          </Panel>
        ) : (
          <div className="mx-auto max-w-3xl">
            <Panel className="p-6 md:p-10">
              <div className="flex items-center justify-between border-b-2 border-slate-700 pb-6">
                <div>
                  <h2 className="text-sm font-bold">
                    UNIVERSIDAD TECNOLÓGICA DEL PERÚ
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Secretaría Académica · Lima Centro
                  </p>
                </div>
                <GraduationCap size={32} className="text-slate-500" />
              </div>
              <h3 className="my-8 text-center text-xl font-bold">
                CONSTANCIA DE MATRÍCULA
              </h3>
              <p className="text-sm leading-7 text-slate-600">
                Se deja constancia que el estudiante{" "}
                <strong className="text-slate-800">
                  Sebastián Ramírez Torres
                </strong>
                , con código <strong>U20210482</strong>, se encuentra
                {completed ? " matriculado" : " preparando su matrícula"} en la
                carrera de <strong>Ingeniería de Sistemas e Informática</strong>
                , en el ciclo académico <strong>2026-II</strong>.
              </p>
              <div className="mt-7 divide-y divide-border">
                {enrolledChoices.map((choice) => (
                  <div
                    key={choice.courseId}
                    className="flex justify-between gap-4 py-4 text-xs"
                  >
                    <div>
                      <strong>{courseById(choice.courseId).name}</strong>
                      <p className="mt-1.5 text-slate-500">
                        {sectionLabel(sectionByChoice(choice))} ·{" "}
                        {schedule(sectionByChoice(choice))}
                      </p>
                    </div>
                    <span className="shrink-0">
                      {courseById(choice.courseId).credits} créditos
                      <span className="mt-1 block text-slate-500">
                        {money(
                          courseById(choice.courseId).credits * CREDIT_RATE,
                        )}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm font-semibold">
                <span>Total matriculado</span>
                <span>{credits} créditos</span>
              </div>
              {billingSummary()}
              <div className="mt-10 flex items-center gap-3 rounded-lg bg-slate-50 p-4">
                <FileCheck2 size={24} className="text-slate-500" />
                <div>
                  <p className="text-xs font-medium">
                    {stored.receipt?.code || "Pendiente de confirmación"}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {stored.receipt
                      ? `${
                          completed ? "Emitida el" : "Último registro:"
                        } ${stored.receipt.date}`
                      : "Confirma tu matrícula para emitir el documento."}
                  </p>
                </div>
              </div>
            </Panel>
            <p className="mt-4 text-center text-[11px] text-slate-500">
              Documento académico de uso personal.
            </p>
          </div>
        )}
        {!choices.length && billingSummary()}
      </>
    )
  }
  function paymentsPage() {
    return (
      <>
        <Heading
          eyebrow="Tu cuenta académica"
          title="Pagos y cuotas"
          subtitle="Consulta el costo de tus cursos y el plan de pagos del ciclo 2026-II."
        />
        {!choices.length && (
          <div className="mb-5">
            <Notice>
              Aún no tienes cursos matriculados. Tus cuotas se calcularán cuando
              te matricules
            </Notice>
          </div>
        )}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Panel className="p-5">
            <p className="text-xs text-slate-500">Monto de cada cuota</p>
            <p className="mt-3 text-3xl font-bold">{money(installment)}</p>
            <p className="mt-2 text-[11px] text-slate-500">
              5 cuotas · Todas pendientes
            </p>
          </Panel>
          <Panel className="p-5">
            <p className="text-xs text-slate-500">Costo total del ciclo</p>
            <p className="mt-3 text-3xl font-bold">{money(totalCost)}</p>
            <p className="mt-2 text-[11px] text-slate-500">
              {credits} créditos × {money(CREDIT_RATE)}
            </p>
          </Panel>
          <Panel className="p-5">
            <Badge tone="success">Matrícula pagada</Badge>
            <p className="mt-4 text-sm font-semibold">
              Derecho de matrícula cancelado
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              Es el único concepto pagado. Se registra por separado del costo de
              tus cursos.
            </p>
          </Panel>
        </div>
        {!completed && choices.length > 0 && (
          <div className="mb-5">
            <Notice>
              Estos montos corresponden a tu matrícula en preparación. Se
              actualizan con cada cambio de curso.{" "}
              {periodOpen
                ? "Confirma tu matrícula para emitir la constancia."
                : PERIOD_CLOSED_MESSAGE}
            </Notice>
          </div>
        )}
        <Panel className="mb-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <h2 className="text-sm font-semibold">Desglose por curso</h2>
            <span className="text-[11px] text-slate-500">
              Tarifa por crédito: {money(CREDIT_RATE)} por ciclo
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase">
                <tr>
                  {["Curso", "Créditos", "Costo del ciclo"].map((label) => (
                    <th key={label} className="px-5 py-4 font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {choices.map((choice) => {
                  const target = courseById(choice.courseId)
                  return (
                    <tr key={choice.courseId}>
                      <td className="px-5 py-5 font-medium">{target.name}</td>
                      <td className="px-5 py-5">{target.credits}</td>
                      <td className="px-5 py-5 font-medium">
                        {money(target.credits * CREDIT_RATE)}
                      </td>
                    </tr>
                  )
                })}
                {!choices.length && (
                  <tr>
                    <td colSpan={3} className="px-5 py-6 text-slate-500">
                      No tienes cursos matriculados.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="border-t border-border bg-slate-50 font-semibold">
                <tr>
                  <td className="px-5 py-4">Total</td>
                  <td className="px-5 py-4">{credits} créditos</td>
                  <td className="px-5 py-4">{money(totalCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Panel>
        <Panel className="overflow-hidden">
          <div className="border-b border-border p-5">
            <h2 className="text-sm font-semibold">Plan de pagos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase">
                <tr>
                  {["Concepto", "Vencimiento", "Monto", "Estado"].map(
                    (label) => (
                      <th key={label} className="px-5 py-4 font-medium">
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-5 py-5 font-medium">Matrícula</td>
                  <td className="px-5 py-5 text-slate-500">
                    Derecho de matrícula cancelado
                  </td>
                  <td className="px-5 py-5 text-slate-500">—</td>
                  <td className="px-5 py-5">
                    <Badge tone="success">Pagado</Badge>
                  </td>
                </tr>
                {[1, 2, 3, 4, 5].map((number) => (
                  <tr key={number}>
                    <td className="px-5 py-5 font-medium">Cuota {number}</td>
                    <td className="px-5 py-5 text-slate-500">
                      {
                        [
                          "21 de agosto",
                          "21 de septiembre",
                          "21 de octubre",
                          "21 de noviembre",
                          "15 de diciembre",
                        ][number - 1]
                      }{" "}
                      de 2026
                    </td>
                    <td className="px-5 py-5 font-medium">
                      {money(installment)}
                    </td>
                    <td className="px-5 py-5">
                      <Badge tone="warning" icon={Clock3}>
                        Pendiente
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <div className="mt-5">
          <Notice>
            El costo total es la suma de los créditos de tus cursos ×{" "}
            {money(CREDIT_RATE)}. Se distribuye en 5 cuotas iguales. El derecho
            de matrícula ya está pagado y no se incluye en ese total.
          </Notice>
        </div>
      </>
    )
  }
  function helpPage() {
    const faqs = [
      {
        question: "¿Cuántos créditos puedo matricular?",
        answer:
          "Puedes matricular entre 3 y 24 créditos por ciclo. El portal calcula tu carga y te informa si necesitas agregar o quitar cursos.",
      },
      {
        question: "¿Mi selección reserva una vacante?",
        answer:
          "Al agregar un curso se descuenta una vacante de su sección; al quitarlo se libera. La disponibilidad se verifica al confirmar. Si una sección deja de estar disponible, puedes cambiarla sin perder tus otros cursos.",
      },
      {
        question: "¿Cómo cambio el horario de un curso?",
        answer:
          "Ingresa al resumen y selecciona Cambiar horario en el curso que deseas modificar. Elige una sección con vacantes y sin cruces de horario.",
      },
      {
        question: "¿Qué hago si me falta un prerrequisito?",
        answer:
          "Debes aprobar el curso indicado como prerrequisito. Si consideras que tu avance no está actualizado, envía una consulta a soporte académico.",
      },
      {
        question: "¿Dónde descargo mi constancia?",
        answer:
          "Al registrar tu matrícula, entra a Constancia de matrícula y selecciona Descargar PDF. También puedes descargarla desde la pantalla de confirmación.",
      },
      {
        question: "¿Puedo modificar una matrícula registrada?",
        answer:
          "Sí. Durante el periodo de matrícula puedes usar Modificar matrícula para agregar o quitar cursos y cambiar secciones. Confirma los cambios para emitir una constancia actualizada. Al finalizar el periodo, las modificaciones se bloquean.",
      },
    ]
    return (
      <>
        <Heading
          eyebrow="Estamos para ayudarte"
          title="Ayuda y soporte"
          subtitle="Encuentra respuestas o comunícate con nuestro equipo de atención."
        />
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_350px]">
          <Panel>
            <div className="border-b border-border p-5">
              <h2 className="text-sm font-semibold">Preguntas frecuentes</h2>
            </div>
            <div className="divide-y divide-border">
              {faqs.map((faq) => (
                <details key={faq.question} className="group px-5">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 text-xs font-semibold">
                    {faq.question}
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="pb-5 text-xs leading-6 text-slate-500">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </Panel>
          <div className="space-y-5">
            <Panel className="p-5">
              <h2 className="text-sm font-semibold">Soporte académico</h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Lunes a sábado · 8:00 a 20:00 h
              </p>
              <a
                href="mailto:soporteacademico@utp.edu.pe"
                className="mt-4 flex min-h-11 items-center gap-2 text-xs text-slate-600 hover:text-primary"
              >
                <Mail size={16} />
                soporteacademico@utp.edu.pe
              </a>
              <a
                href="tel:+5113159600"
                className="flex min-h-11 items-center text-xs text-slate-600 hover:text-primary"
              >
                Central: (01) 315-9600
              </a>
            </Panel>
            <Panel className="p-5">
              <h2 className="text-sm font-semibold">Envía tu consulta</h2>
              {supportSent ? (
                <div className="mt-4">
                  <Notice tone="success" title="Recibimos tu consulta">
                    Solicitud SOP-2026-1842. Te responderemos a tu correo
                    institucional en un día hábil.
                  </Notice>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setSupportSent(false)
                      setSupportMessage("")
                    }}
                  >
                    Enviar otra consulta
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (supportMessage.trim().length < 15) {
                      setSupportError(
                        "Describe tu consulta con al menos 15 caracteres para que podamos ayudarte.",
                      )
                      return
                    }
                    setSupportError("")
                    setSupportSent(true)
                  }}
                >
                  <label
                    className="mt-5 block text-[11px] font-medium"
                    htmlFor="support-topic"
                  >
                    Tema
                  </label>
                  <select
                    id="support-topic"
                    value={supportTopic}
                    onChange={(event) => setSupportTopic(event.target.value)}
                    className="mt-2 min-h-11 w-full rounded-lg border border-border px-3 text-xs"
                  >
                    {[
                      "Matrícula y horarios",
                      "Avance académico",
                      "Pagos y cuotas",
                      "Acceso al portal",
                    ].map((topic) => (
                      <option key={topic}>{topic}</option>
                    ))}
                  </select>
                  <label
                    className="mt-4 block text-[11px] font-medium"
                    htmlFor="support-message"
                  >
                    ¿En qué podemos ayudarte?
                  </label>
                  <textarea
                    id="support-message"
                    value={supportMessage}
                    onChange={(event) => {
                      setSupportMessage(event.target.value)
                      setSupportError("")
                    }}
                    placeholder="Cuéntanos qué ocurrió y qué necesitas."
                    className="mt-2 min-h-28 w-full resize-y rounded-lg border border-border p-3 text-xs"
                    aria-invalid={!!supportError}
                    aria-describedby={
                      supportError ? "support-error" : undefined
                    }
                  />
                  {supportError && (
                    <p
                      id="support-error"
                      className="mt-1 text-[11px] text-red-700"
                    >
                      {supportError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    className="mt-4 w-full"
                    icon={Mail}
                  >
                    Enviar consulta
                  </Button>
                </form>
              )}
            </Panel>
          </div>
        </div>
      </>
    )
  }

  function loginPage() {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <header className="border-b border-border px-6 py-5">
          <img
            src={logo}
            alt="UTP · Universidad Tecnológica del Perú"
            className="h-10 w-auto"
          />
        </header>
        <main className="grid flex-1 lg:grid-cols-2">
          <div className="hidden flex-col justify-center bg-[#f2f6fc] p-16 lg:flex">
            <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              <GraduationCap size={32} strokeWidth={1.5} />
            </div>
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Portal de Matrícula
            </p>
            <h1 className="mt-5 max-w-lg text-5xl leading-tight font-bold tracking-[-1px]">
              Tu futuro.
              <br />
              Tu siguiente paso.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-500">
              Organiza tus cursos, elige tus horarios y empieza el ciclo con
              todo listo.
            </p>
            <div className="mt-10 flex gap-2 text-xs text-slate-500">
              <ShieldCheck size={16} />
              Acceso seguro para estudiantes UTP
            </div>
          </div>
          <div className="flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-sm">
              <Badge tone="blue" icon={UserRound}>
                Estudiantes · 2026-II
              </Badge>
              <h2 className="mt-5 text-3xl font-bold">
                {authMode === "login"
                  ? "Te damos la bienvenida"
                  : authMode === "recover"
                    ? "Recupera tu acceso"
                    : authMode === "reset"
                      ? "Crea una nueva contraseña"
                      : "Tu acceso está listo"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {authMode === "login"
                  ? "Ingresa con tu código y contraseña institucional."
                  : authMode === "recover"
                    ? "Verifica tu correo institucional para recuperar tu cuenta."
                    : authMode === "reset"
                      ? "Tu correo fue verificado. Elige una contraseña de al menos 8 caracteres."
                      : "Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión."}
              </p>
              {authMode === "done" ? (
                <div className="mt-6">
                  <Notice tone="success">
                    Contraseña actualizada. Usa tu nueva contraseña al ingresar.
                  </Notice>
                  <Button
                    className="mt-6 w-full"
                    variant="primary"
                    onClick={() => {
                      setAuthMode("login")
                      setPassword("")
                    }}
                  >
                    Ir a iniciar sesión
                  </Button>
                </div>
              ) : (
                <form
                  className="mt-7 space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault()
                    setAuthError({})
                    if (authMode === "login") {
                      if (!studentCode.trim()) {
                        setAuthError({
                          code: "Ingresa tu código de estudiante.",
                        })
                        return
                      }
                      if (!password) {
                        setAuthError({
                          password: "Ingresa tu contraseña institucional.",
                        })
                        return
                      }
                      setBusy(true)
                      setTimeout(() => {
                        setBusy(false)
                        if (
                          studentCode.toUpperCase() !== "U20210482" ||
                          password !== stored.password
                        ) {
                          setAuthError({
                            password:
                              "Código o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.",
                          })
                        } else {
                          setStored((previous) => ({
                            ...previous,
                            authenticated: true,
                          }))
                          go("/")
                        }
                      }, 650)
                    } else if (authMode === "recover") {
                      if (
                        email.toLowerCase().trim() !== "u20210482@utp.edu.pe"
                      ) {
                        setAuthError({
                          email:
                            "No encontramos ese correo. Usa u20210482@utp.edu.pe o solicita ayuda de acceso.",
                        })
                        return
                      }
                      setBusy(true)
                      setTimeout(() => {
                        setBusy(false)
                        setAuthMode("reset")
                        setPassword("")
                      }, 600)
                    } else {
                      if (password.length < 8) {
                        setAuthError({
                          password:
                            "La contraseña es muy corta. Usa al menos 8 caracteres.",
                        })
                        return
                      }
                      setStored((previous) => ({ ...previous, password }))
                      setAuthMode("done")
                    }
                  }}
                >
                  {authMode === "login" && (
                    <div>
                      <label
                        htmlFor="student-code"
                        className="text-xs font-semibold"
                      >
                        Código de estudiante
                      </label>
                      <input
                        id="student-code"
                        autoComplete="username"
                        value={studentCode}
                        onChange={(event) => {
                          setStudentCode(event.target.value)
                          setAuthError({})
                        }}
                        className="mt-2 h-12 w-full rounded-lg border border-border px-3 text-sm"
                        placeholder="Ej. U20210482"
                        aria-invalid={!!authError.code}
                        aria-describedby={
                          authError.code ? "code-error" : undefined
                        }
                      />
                      {authError.code && (
                        <p
                          id="code-error"
                          className="mt-2 text-xs text-red-700"
                        >
                          {authError.code}
                        </p>
                      )}
                    </div>
                  )}
                  {authMode === "recover" ? (
                    <div>
                      <label
                        htmlFor="recovery-email"
                        className="text-xs font-semibold"
                      >
                        Correo institucional
                      </label>
                      <input
                        id="recovery-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value)
                          setAuthError({})
                        }}
                        className="mt-2 h-12 w-full rounded-lg border border-border px-3 text-sm"
                        placeholder="u20210482@utp.edu.pe"
                        aria-invalid={!!authError.email}
                        aria-describedby={
                          authError.email ? "email-error" : undefined
                        }
                      />
                      {authError.email && (
                        <p
                          id="email-error"
                          className="mt-2 text-xs text-red-700"
                        >
                          {authError.email}
                        </p>
                      )}
                      <p className="mt-3 text-[11px] leading-5 text-slate-500">
                        La verificación de esta cuenta se realiza en el portal.
                        No se enviará un correo.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="password"
                        className="text-xs font-semibold"
                      >
                        {authMode === "reset"
                          ? "Nueva contraseña"
                          : "Contraseña"}
                      </label>
                      <div className="relative mt-2">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete={
                            authMode === "reset"
                              ? "new-password"
                              : "current-password"
                          }
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value)
                            setAuthError({})
                          }}
                          className="h-12 w-full rounded-lg border border-border pr-12 pl-3 text-sm"
                          placeholder="Ingresa tu contraseña"
                          aria-invalid={!!authError.password}
                          aria-describedby={
                            authError.password ? "password-error" : undefined
                          }
                        />
                        <button
                          type="button"
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-0 right-0 flex size-12 items-center justify-center text-slate-400"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {authError.password && (
                        <p
                          id="password-error"
                          className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-red-700"
                        >
                          <CircleAlert size={14} className="mt-0.5 shrink-0" />
                          {authError.password}
                        </p>
                      )}
                    </div>
                  )}
                  {authMode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("recover")
                        setAuthError({})
                      }}
                      className="min-h-11 text-xs font-medium text-primary"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                  <Button
                    type="submit"
                    disabled={busy}
                    variant="primary"
                    className="w-full"
                    icon={busy ? LoaderCircle : ArrowRight}
                  >
                    {busy
                      ? "Verificando…"
                      : authMode === "login"
                        ? "Ingresar al portal"
                        : authMode === "recover"
                          ? "Verificar mi cuenta"
                          : "Guardar nueva contraseña"}
                  </Button>
                  {authMode !== "login" && (
                    <Button
                      className="w-full"
                      onClick={() => {
                        setAuthMode("login")
                        setAuthError({})
                        setPassword("")
                      }}
                      icon={ArrowLeft}
                    >
                      Volver al inicio de sesión
                    </Button>
                  )}
                </form>
              )}
              <div className="mt-7 border-t border-border pt-5">
                <button
                  onClick={() => setAccessHelp(!accessHelp)}
                  className="flex min-h-11 items-center gap-2 text-xs text-slate-600"
                >
                  <HelpCircle size={16} />
                  Ayuda de acceso
                  <ChevronDown size={14} />
                </button>
                {accessHelp && (
                  <div className="mt-3">
                    <Notice>
                      Cuenta de estudiante: <strong>U20210482</strong>.
                      Contraseña inicial: <strong>Utp2026!</strong>. Si
                      cambiaste la contraseña, usa la recuperación con{" "}
                      <strong>u20210482@utp.edu.pe</strong>.
                      <a
                        href="mailto:soporteacademico@utp.edu.pe"
                        className="mt-2 block min-h-11 underline"
                      >
                        Contactar a soporte
                      </a>
                    </Notice>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <footer className="border-t border-border p-5 text-center text-[10px] text-slate-500">
          © 2026 Universidad Tecnológica del Perú · Todos los derechos
          reservados
        </footer>
      </div>
    )
  }
  if (!stored.authenticated) return loginPage()
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#contenido-principal"
        className="sr-only fixed top-3 left-3 z-50 rounded-lg bg-primary px-5 py-3 text-sm text-white focus:not-sr-only"
      >
        Ir al contenido principal
      </a>
      <header className="fixed inset-x-0 top-0 z-30 flex h-[76px] items-center justify-between border-b border-border bg-white px-4 md:px-7">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Abrir menú de navegación"
            className="flex size-11 items-center justify-center rounded-lg text-slate-500 lg:hidden"
          >
            <Menu size={22} />
          </button>
          <button
            onClick={() => go("/")}
            aria-label="Ir al inicio"
            className="min-h-11"
          >
            <img
              src={logo}
              alt="UTP · Universidad Tecnológica del Perú"
              className="h-9 w-auto sm:h-10"
            />
          </button>
          <span className="hidden h-7 w-px bg-border xl:block" />
          <span className="hidden text-sm font-semibold text-[#D71920] xl:block">
            Portal de Matrícula
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-5">
          <span className="hidden rounded-md border border-border bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 sm:block">
            Ciclo 2026-II
          </span>
          <div className="relative">
            <button
              aria-label="Ver notificaciones"
              onClick={() => {
                setNotifications(!notifications)
                setUserMenu(false)
              }}
              className="relative flex size-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50"
            >
              <Bell size={19} strokeWidth={1.7} />
              <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-blue-600" />
            </button>
            {notifications && (
              <div className="absolute top-14 right-0 w-72 rounded-xl border border-border bg-white p-5 shadow-xl">
                <h2 className="text-sm font-semibold">Notificaciones</h2>
                <div className="mt-4 flex gap-3">
                  <Info size={17} className="shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold">
                      {periodOpen
                        ? "Matrícula 2026-II abierta"
                        : "Periodo de matrícula finalizado"}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      {periodOpen
                        ? `Puedes elegir tus cursos hasta el ${PERIOD_END_LABEL}.`
                        : PERIOD_CLOSED_MESSAGE}
                    </p>
                    <button
                      onClick={() => go("/matricula")}
                      className="mt-2 min-h-11 text-xs text-primary"
                    >
                      Ir a matrícula
                      <ArrowRight size={12} className="ml-1 inline" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <span className="hidden h-7 w-px bg-border sm:block" />
          <div className="relative">
            <button
              onClick={() => {
                setUserMenu(!userMenu)
                setNotifications(false)
              }}
              aria-expanded={userMenu}
              aria-label="Menú del estudiante"
              className="flex min-h-11 items-center gap-3"
            >
              <span className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[11px] font-semibold text-slate-600">
                SR
              </span>
              <span className="hidden text-left md:block">
                <span className="block text-xs font-semibold">
                  Sebastián Ramírez
                </span>
                <span className="mt-1 block text-[10px] text-slate-500">
                  U20210482
                </span>
              </span>
              <ChevronDown
                size={14}
                className="hidden text-slate-400 sm:block"
              />
            </button>
            {userMenu && (
              <div className="absolute top-14 right-0 w-64 rounded-xl border border-border bg-white p-2 shadow-xl">
                <div className="border-b border-border px-3 py-3">
                  <p className="text-xs font-semibold">
                    Sebastián Ramírez Torres
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    u20210482@utp.edu.pe
                  </p>
                </div>
                <button
                  onClick={() => go("/malla")}
                  className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <GraduationCap size={15} />
                  Mi información académica
                </button>
                <button
                  onClick={() => {
                    setStored((previous) => ({
                      ...previous,
                      authenticated: false,
                    }))
                    setUserMenu(false)
                    setAuthMode("login")
                    setPassword("")
                  }}
                  className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <LogOut size={15} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {mobileMenu && (
        <button
          aria-label="Cerrar menú de navegación"
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
        />
      )}
      <aside
        className={`fixed top-[76px] bottom-0 left-0 z-40 flex w-[238px] flex-col border-r border-border bg-white transition-transform lg:z-20 lg:translate-x-0 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 pt-7">
          <p className="mb-4 px-3 text-[9px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
            Portal del estudiante
          </p>
          <nav className="space-y-1.5" aria-label="Navegación principal">
            {navItems.map((item) => {
              const active = current?.path === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[12px] transition-colors ${
                    active
                      ? "bg-blue-50 font-semibold text-primary"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <item.icon size={18} strokeWidth={active ? 2 : 1.6} />
                  {item.label}
                  {item.path === "/matricula" && !completed && (
                    <span className="ml-auto flex size-5 items-center justify-center rounded-md bg-blue-100 text-[9px] font-semibold text-primary">
                      {choices.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-5">
          <div className="rounded-xl border border-border bg-slate-50/60 p-4">
            <div className="mb-3 flex size-8 items-center justify-center rounded-lg border border-border bg-white text-slate-500">
              <LifeBuoy size={17} />
            </div>
            <p className="text-xs font-semibold">Estamos para ayudarte</p>
            <p className="mt-2 text-[10px] leading-5 text-slate-500">
              Resuelve tus dudas con nuestro equipo de soporte.
            </p>
            <button
              onClick={() => go("/ayuda")}
              className="mt-3 flex min-h-11 items-center gap-2 text-[10px] font-semibold text-slate-600"
            >
              Contactar a soporte
              <ArrowRight size={13} />
            </button>
          </div>
          <div className="mt-5 flex items-center gap-2 px-2 text-[9px] text-slate-400">
            <ShieldCheck size={13} />
            Conexión segura · UTP
          </div>
        </div>
      </aside>
      <main
        id="contenido-principal"
        tabIndex={-1}
        className={`pt-[76px] lg:ml-[238px] ${
          isEnrollment && step < 4 && !completed ? "pb-28" : "pb-4"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-5 py-7 md:px-8 md:py-8 xl:px-10">
          {isEnrollment && periodPanel()}
          {pathname === "/" ? (
            homePage()
          ) : pathname === "/matricula" ? (
            coursesPage()
          ) : pathname === "/matricula/horarios" ? (
            sectionsPage()
          ) : pathname === "/matricula/resumen" ? (
            summaryPage()
          ) : pathname === "/matricula/confirmacion" ? (
            successPage()
          ) : pathname === "/horario" ? (
            schedulePage()
          ) : pathname === "/malla" ? (
            curriculumPage()
          ) : pathname === "/constancia" ? (
            certificatePage()
          ) : pathname === "/pagos" ? (
            paymentsPage()
          ) : pathname === "/ayuda" ? (
            helpPage()
          ) : (
            <Panel className="p-10">
              <Heading
                eyebrow="Navegación"
                title="No encontramos esta página"
                subtitle="La dirección no corresponde a un módulo del portal. Regresa al inicio para continuar."
              />
              <Button onClick={() => go("/")} variant="primary">
                Ir al inicio
              </Button>
            </Panel>
          )}
          <footer className="mt-9 flex flex-wrap justify-between gap-3 border-t border-border pt-5 text-[9px] text-slate-400">
            <span>© 2026 Universidad Tecnológica del Perú</span>
            <span>Portal de Matrícula · Tu información está protegida</span>
          </footer>
        </div>
      </main>
      {isEnrollment && step < 4 && !completed && (
        <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-border bg-white/95 px-5 py-4 backdrop-blur-sm lg:left-[238px] md:px-8">
          <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold">
                Mi selección: {choices.length} cursos · {credits} créditos
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {credits} de 24 créditos · mínimo 3
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {!periodOpen
                  ? PERIOD_CLOSED_MESSAGE
                  : credits < MIN_CREDITS
                    ? "Necesitas al menos 3 créditos para confirmar tu matrícula"
                    : credits > MAX_CREDITS
                      ? "Superas el máximo de 24 créditos. Quita un curso para continuar."
                      : invalidChoices.length && !effectiveError
                        ? "Hay una sección sin vacantes. Cambia su horario para confirmar."
                        : "Tu selección se guarda automáticamente."}
              </p>
            </div>
            <Button
              variant="primary"
              disabled={
                busy ||
                !periodOpen ||
                (step === 3 &&
                  (credits < MIN_CREDITS ||
                    credits > MAX_CREDITS ||
                    !!invalidChoices.length) &&
                  !effectiveError)
              }
              onClick={() =>
                step < 3
                  ? openSummary()
                  : effectiveError
                    ? setChangeCourse(effectiveError.courseId)
                    : setConfirmModal(true)
              }
              icon={busy ? LoaderCircle : step === 3 ? ShieldCheck : ArrowRight}
              className="shrink-0 text-[11px] md:px-6"
            >
              {busy
                ? "Verificando…"
                : step < 3
                  ? "Continuar al resumen"
                  : effectiveError
                    ? "Elegir otro horario"
                    : "Confirmar matrícula"}
            </Button>
          </div>
        </div>
      )}
      {toast && (
        <div
          role="status"
          className="fixed top-24 right-5 z-50 flex max-w-[calc(100%-2.5rem)] items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 shadow-lg"
        >
          <CircleCheck size={20} className="shrink-0 text-emerald-700" />
          <p className="text-xs leading-5 font-medium">{toast}</p>
          <button
            onClick={() => setToast("")}
            className="flex size-11 shrink-0 items-center justify-center text-slate-400"
            aria-label="Cerrar aviso"
          >
            <X size={15} />
          </button>
        </div>
      )}
      {changeCourse && (
        <Modal
          title="Cambiar horario"
          subtitle={`${courseById(changeCourse).name} · ${courseById(changeCourse).credits} créditos`}
          onClose={() => setChangeCourse(null)}
          wide
        >
          <Notice>
            Elige una nueva sección. Tu horario actual se conserva hasta que
            elijas otra disponible.
          </Notice>
          <div className="mt-5 -mx-6">
            {sectionTable(courseById(changeCourse), true)}
          </div>
          {actionError && (
            <div className="mt-4">
              <Notice tone="error">{actionError}</Notice>
            </div>
          )}
          <div className="mt-5 flex justify-end">
            <Button onClick={() => setChangeCourse(null)}>
              Mantener horario actual
            </Button>
          </div>
        </Modal>
      )}
      {removeCourse && (
        <Modal
          title="¿Quitar este curso de tu matrícula?"
          onClose={() => setRemoveCourse(null)}
        >
          <p className="text-sm leading-6 text-slate-500">
            Se quitará{" "}
            <strong className="text-slate-800">
              {courseById(removeCourse).name}
            </strong>{" "}
            y sus {courseById(removeCourse).credits} créditos de tu selección.
            Tus otros cursos permanecerán guardados.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Puedes volver a agregarlo si tiene vacantes disponibles.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button onClick={() => setRemoveCourse(null)}>
              Conservar curso
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={removeSelected}
              disabled={!periodOpen || busy}
            >
              Quitar curso
            </Button>
          </div>
          {(!periodOpen || actionError) && (
            <div className="mt-3">
              <Notice tone="error">
                {actionError || PERIOD_CLOSED_MESSAGE}
              </Notice>
            </div>
          )}
        </Modal>
      )}
      {confirmModal && (
        <Modal
          title="Verifica tu matrícula"
          subtitle="Se registrarán estos cursos en el ciclo 2026-II."
          onClose={() => {
            if (!busy) setConfirmModal(false)
          }}
        >
          <div className="mb-5 flex justify-between rounded-lg bg-slate-50 p-4 text-sm font-semibold">
            <span>{choices.length} cursos</span>
            <span>{credits} créditos</span>
          </div>
          <div className="divide-y divide-border">
            {choices.map((choice) => (
              <div key={choice.courseId} className="py-3">
                <p className="text-xs font-semibold">
                  {courseById(choice.courseId).name}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {sectionLabel(sectionByChoice(choice))} ·{" "}
                  {schedule(sectionByChoice(choice))}
                </p>
              </div>
            ))}
          </div>
          {billingSummary()}
          <div className="mt-5">
            <Notice tone="success">
              Sin cruces de horario. La disponibilidad se verificará al
              registrar tu matrícula.
            </Notice>
          </div>
          {actionError && (
            <div className="mt-3">
              <Notice tone="error">{actionError}</Notice>
            </div>
          )}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button disabled={busy} onClick={() => setConfirmModal(false)}>
              Revisar de nuevo
            </Button>
            <Button
              disabled={
                busy ||
                !periodOpen ||
                credits < MIN_CREDITS ||
                credits > MAX_CREDITS ||
                invalidChoices.length > 0
              }
              variant="primary"
              icon={busy ? LoaderCircle : ShieldCheck}
              onClick={confirmEnrollment}
            >
              {busy ? "Registrando…" : "Sí, confirmar"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
const router = createBrowserRouter([{ path: "*", Component: Portal }])
export default function App() {
  return <RouterProvider router={router} />
}
