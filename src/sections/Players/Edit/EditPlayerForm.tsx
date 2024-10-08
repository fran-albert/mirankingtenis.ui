// "use client";
// import { CitySelect } from "@/components/Select/City/select";
// import { StateSelect } from "@/components/Select/State/select";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { goBack } from "@/lib/utils";
// import React, { useEffect, useRef, useState } from "react";
// import { FaCamera } from "react-icons/fa";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import { toast } from "sonner";
// import Image from "next/image";

// import "react-datepicker/dist/react-datepicker.css";
// import { User } from "@/types/User/User";
// import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
// import { getUser } from "@/modules/users/application/get/getUser";
// import { State } from "@/types/State/State";
// import { City } from "@/types/City/City";
// interface Inputs extends User {}

// function EditPlayerForm({ user }: { user: User | null }) {
//   const [selectedState, setSelectedState] = useState<State | null>(null);
//   const [selectedCity, setSelectedCity] = useState<City | null>(null);
//   const userRepository = createApiUserRepository();
//   const loadUser = getUser(userRepository);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm<Inputs>();
//   //   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const userData = await loadUser(Number(user?.id));
//         setSelectedState(Number(userData?.city));
//         setSelectedCity(Number(userData?.city.id));
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchUsers();
//   }, [loadUser, user?.id]);

//   const handleStateChange = (selectedState: number) => {
//     setSelectedState(selectedState);
//   };

//   return (
//     <>
//       <div className="w-1/2 p-6 mt-4 items-center justify-center border shadow-xl rounded-lg max-w-4xl mx-auto bg-white">
//         <div className="my-4">
//           <div className="flex items-center justify-center text-black font-bold text-xl">
//             <button
//               className="flex items-center justify-start py-2 px-4 w-full"
//               onClick={() => window.history.back()}
//             >
//               <IoMdArrowRoundBack className="text-black mr-2" size={24} />
//               Editar Jugador
//             </button>
//           </div>
//         </div>
//         <div className="flex flex-col items-center text-center">
//           <div className="relative mb-3">
//             <div className="group rounded-2xl overflow-hidden">
//               <Image
//                 src={
//                   user?.photo
//                     ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${user.photo}.jpeg`
//                     : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
//                 }
//                 alt="Imagen del Jugador"
//                 width={100}
//                 height={100}
//                 className="rounded-2xl"
//                 layout="fixed"
//               />

//               <div className="absolute bottom-0 right-0 mb-2 mr-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
//                 <div
//                   className="bg-black p-2 rounded-full cursor-pointer"
//                   //   onClick={() => inputFileRef?.current?.click()}
//                 >
//                   <FaCamera className="text-white" />
//                   <input
//                     type="file"
//                     style={{ display: "none" }}
//                     // ref={inputFileRef}
//                     // onChange={handleImageChange}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-wrap items-center justify-center rounded-lg">
//           <div className="w-full p-4">
//             <h1 className="text-xl font-semibold mb-4">Datos Personales</h1>
//             {/* <form onSubmit={handleSubmit(onSubmit)}> */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <Label htmlFor="name">Nombre</Label>
//                 <Input
//                   // {...register("firstName", { required: true })}
//                   className="w-full bg-gray-200 border-gray-300 text-gray-800"
//                   defaultValue={user?.name}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="lastname">Apellido</Label>
//                 <Input
//                   // {...register("lastName", { required: true })}
//                   className="w-full bg-gray-200 border-gray-300 text-gray-800"
//                   defaultValue={user?.lastname}
//                 />
//               </div>
//             </div>

//             <h1 className="text-xl font-semibold mb-4">Contacto</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <Label htmlFor="email">Correo Electrónico</Label>
//                 <Input
//                   className="w-full bg-gray-200 border-gray-300 text-gray-800"
//                   // {...register("email")}
//                   defaultValue={user?.email}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="phone">Teléfono</Label>
//                 <Input
//                   // {...register("phoneNumber", { required: true })}
//                   className="w-full bg-gray-200 border-gray-300 text-gray-800"
//                   defaultValue={user?.phone}
//                 />
//               </div>
//             </div>

//             <h1 className="text-xl font-semibold mb-4">Ubicación</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <Label htmlFor="state">Provincia</Label>
//                 <StateSelect
//                   control={control}
//                   onStateChange={handleStateChange}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="city">Ciudad</Label>
//                 <CitySelect
//                   idState={Number(selectedState)}
//                   selected={String(selectedCity)}
//                   onCityChange={(value) => {
//                     setSelectedCity(Number(value));
//                     setValue("idCity", value);
//                   }}
//                 />
//               </div>
//             </div>

//             <h1 className="text-xl font-semibold mb-4">Estadísticas</h1>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
//               <div>
//                 <Label htmlFor="street">Ranking Inicial</Label>
//                 <Input
//                   // // {...register("address.street")}
//                   className="bg-gray-200"
//                   // defaultValue={user?.address.street}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="number">Categoría</Label>
//                 <Input
//                   // // {...register("address.number")}
//                   className="bg-gray-200"
//                   // defaultValue={user?.address.number}
//                 />
//               </div>
//             </div>

//             <div className="flex justify-center mt-10">
//               <Button
//                 className="mt-10 m-2"
//                 variant="destructive"
//                 onClick={goBack}
//               >
//                 Cancelar
//               </Button>
//               <Button className=" m-2">Confirmar</Button>
//             </div>
//             {/* </form> */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default EditPlayerForm;
