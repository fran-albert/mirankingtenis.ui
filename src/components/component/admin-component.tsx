"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IoMenu } from "react-icons/io5";
import { signOut } from "next-auth/react";
import SideBarV3 from "./sideBarV2";

export function AdminComponent({ children }: { children: React.ReactNode }) {
  return (
    // <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
    //   <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
    //     <div className="flex h-full max-h-screen flex-col gap-2">
    //       <div className="flex h-[60px] items-center border-b px-6">
    //         <Link className="flex items-center gap-2 font-semibold" href="#">
    //           <MdAdminPanelSettings className="h-6 w-6" color="#1e293b" />
    //           <span className="">Admin Dashboard</span>
    //         </Link>
    //       </div>
    //       <div className="flex-1 overflow-auto py-2">
    //         <nav className="grid items-start px-4 text-sm font-medium">
    //           <Link
    //             className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
    //             href="/admin"
    //           >
    //             <HomeIcon className="h-4 w-4" />
    //             Inicio
    //           </Link>
    //           <Link
    //             className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
    //             href="#"
    //           >
    //             <UsersIcon className="h-4 w-4" />
    //             Gestionar Management
    //           </Link>
    //           <Link
    //             className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
    //             href="#"
    //           >
    //             <PackageIcon className="h-4 w-4" />
    //             Content Management
    //           </Link>
    //           <Link
    //             className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
    //             href="#"
    //           >
    //             <LineChartIcon className="h-4 w-4" />
    //             Analytics
    //           </Link>
    //         </nav>
    //       </div>
    //       <div className="mt-auto p-4">
    //         <Link href="/master">
    //           <Button className="w-full" size="sm">
    //             Volver
    //           </Button>
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="flex flex-col">
    //     <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
    //       <Link className="lg:hidden" href="#">
    //         <Package2Icon className="h-6 w-6" />
    //         <span className="sr-only">Home</span>
    //       </Link>
    //       <div className="w-full flex-1">
    //         <form>
    //           <div className="relative">
    //             <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
    //             <Input
    //               className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
    //               placeholder="Search users..."
    //               type="search"
    //             />
    //           </div>
    //         </form>
    //       </div>
    //     </header>
    //     <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
    //       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    //         <Card>
    //           <CardHeader>
    //             <CardTitle>New Users</CardTitle>
    //             <CardDescription>
    //               <span className="text-4xl font-bold">1,234</span>
    //             </CardDescription>
    //           </CardHeader>
    //           <CardContent>
    //             <LineChart className="w-full aspect-[4/3]" />
    //           </CardContent>
    //         </Card>
    //         <Card>
    //           <CardHeader>
    //             <CardTitle>Active Users</CardTitle>
    //             <CardDescription>
    //               <span className="text-4xl font-bold">5,678</span>
    //             </CardDescription>
    //           </CardHeader>
    //           <CardContent>
    //             <BarChart className="w-full aspect-[4/3]" />
    //           </CardContent>
    //         </Card>
    //         <Card>
    //           <CardHeader>
    //             <CardTitle>Content Published</CardTitle>
    //             <CardDescription>
    //               <span className="text-4xl font-bold">789</span>
    //             </CardDescription>
    //           </CardHeader>
    //           <CardContent>
    //             <TimeseriesChart className="w-full aspect-[4/3]" />
    //           </CardContent>
    //         </Card>
    //         <Card>
    //           <CardHeader>
    //             <CardTitle>Engagement</CardTitle>
    //             <CardDescription>
    //               <span className="text-4xl font-bold">92%</span>
    //             </CardDescription>
    //           </CardHeader>
    //           <CardContent>
    //             <DonutpieChart className="w-full aspect-square" />
    //           </CardContent>
    //         </Card>
    //       </div>
    //       <div className="border shadow-sm rounded-lg">
    //         <Table>
    //           <TableHeader>
    //             <TableRow>
    //               <TableHead>Username</TableHead>
    //               <TableHead>Email</TableHead>
    //               <TableHead className="hidden md:table-cell">
    //                 Registered
    //               </TableHead>
    //               <TableHead className="hidden md:table-cell">
    //                 Last Login
    //               </TableHead>
    //               <TableHead className="hidden md:table-cell">Status</TableHead>
    //               <TableHead>Actions</TableHead>
    //             </TableRow>
    //           </TableHeader>
    //           <TableBody>
    //             <TableRow>
    //               <TableCell className="font-medium">johndoe</TableCell>
    //               <TableCell>johndoe@example.com</TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 2023-04-01
    //               </TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 2023-05-01
    //               </TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 <Badge variant="success">Active</Badge>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="flex items-center gap-2">
    //                   <Button size="sm" variant="outline">
    //                     Edit
    //                   </Button>
    //                   <Button color="danger" size="sm" variant="outline">
    //                     Deactivate
    //                   </Button>
    //                 </div>
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell className="font-medium">janedoe</TableCell>
    //               <TableCell>janedoe@example.com</TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 2023-03-15
    //               </TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 2023-04-30
    //               </TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 <Badge variant="success">Active</Badge>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="flex items-center gap-2">
    //                   <Button size="sm" variant="outline">
    //                     Edit
    //                   </Button>
    //                   <Button color="danger" size="sm" variant="outline">
    //                     Deactivate
    //                   </Button>
    //                 </div>
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell className="font-medium">bobsmith</TableCell>
    //               <TableCell>bobsmith@example.com</TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 2023-02-20
    //               </TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 2023-04-15
    //               </TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 <Badge variant="danger">Inactive</Badge>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="flex items-center gap-2">
    //                   <Button size="sm" variant="outline">
    //                     Edit
    //                   </Button>
    //                   <Button color="success" size="sm" variant="outline">
    //                     Activate
    //                   </Button>
    //                 </div>
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell className="font-medium">sarahjones</TableCell>
    //               <TableCell>sarahjones@example.com</TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 2023-01-01
    //               </TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 2023-05-01
    //               </TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 <Badge variant="success">Active</Badge>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="flex items-center gap-2">
    //                   <Button size="sm" variant="outline">
    //                     Edit
    //                   </Button>
    //                   <Button color="danger" size="sm" variant="outline">
    //                     Deactivate
    //                   </Button>
    //                 </div>
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell className="font-medium">mikebrownlee</TableCell>
    //               <TableCell>mikebrownlee@example.com</TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 2022-12-01
    //               </TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 2023-04-30
    //               </TableCell>
    //               <TableCell className="hidden md:table-cell">
    //                 <Badge variant="success">Active</Badge>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="flex items-center gap-2">
    //                   <Button size="sm" variant="outline">
    //                     Edit
    //                   </Button>
    //                   <Button color="danger" size="sm" variant="outline">
    //                     Deactivate
    //                   </Button>
    //                 </div>
    //               </TableCell>
    //             </TableRow>
    //           </TableBody>
    //         </Table>
    //       </div>
    //     </main>
    //   </div>
    // </div>
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <SideBarV3 />
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <div className="flex items-center md:hidden ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                  size="icon"
                  variant="ghost"
                >
                  <IoMenu size={25} />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                  }}
                >
                  Logout
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-xl">
              Panel de Control - Mi Ranking Tenis
            </h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-gray-50">
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> */}
          {children}
          {/* </div> */}
        </main>
      </div>
    </div>
  );
}
