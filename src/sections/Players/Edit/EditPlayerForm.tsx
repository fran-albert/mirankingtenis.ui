"use client";
import { CitySelect } from "@/components/Select/City/select";
import { StateSelect } from "@/components/Select/State/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { goBack } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { getUser } from "@/modules/users/application/get/getUser";
interface Inputs extends User {}

function EditPlayerForm({ user }: { user: User | null }) {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    undefined
  );
  const userRepository = createApiUserRepository();
  const loadUser = getUser(userRepository);
  //   const {
  //     register,
  //     handleSubmit,
  //     watch,
  //     formState: { errors },
  //     setValue,
  //   } = useForm<Inputs>();
  //   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await loadUser(Number(user?.id));
        setSelectedState(String(userData?.city.idState));
        setSelectedCity(String(userData?.city.id));
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);
  //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
  //   const inputFileRef = useRef<HTMLInputElement>(null);
  const handleStateChange = (idState: string) => {
    setSelectedState(idState);
    setSelectedCity(undefined);
  };

  const handleCityChange = (idCity: string) => {
    setSelectedCity(idCity);
  };

  //   const handleHealthInsuranceChange = (healthInsurance: HealthInsurance) => {
  //     setSelectedHealthInsurance(healthInsurance);
  //   };

  //   const handlePlanChange = (plan: HealthPlans) => {
  //     console.log("Plan de salud seleccionado (handlePlanChange):", plan);
  //     setSelectedPlan([plan]);
  //   };

  //   const onSubmit: SubmitHandler<Inputs> = async (data) => {
  //     const formData = new FormData();
  //     console.log("Datos del formulario antes de enviar:", data);
  //     console.log("Plan de salud seleccionado antes de enviar:", selectedPlan);
  //     formData.append("UserName", data.userName);
  //     formData.append(
  //       "FirstName",
  //       data.firstName.charAt(0).toUpperCase() +
  //         data.firstName.slice(1).toLowerCase()
  //     );
  //     formData.append(
  //       "LastName",
  //       data.lastName.charAt(0).toUpperCase() +
  //         data.lastName.slice(1).toLowerCase()
  //     );

  //     console.log(data.birthDate, "cumpleaños");

  //     formData.append("Email", data.email.toLowerCase());
  //     formData.append("PhoneNumber", data.phoneNumber);
  //     formData.append("BirthDate", data.birthDate.toString());

  //     if (selectedFile) {
  //       formData.append("Photo", selectedFile);
  //     }

  //     formData.append("Address.Street", data.address?.street);
  //     formData.append("Address.Number", data.address?.number);
  //     formData.append("Address.Description", data.address?.description);
  //     formData.append("Address.PhoneNumber", data.address?.phoneNumber);
  //     formData.append("Address.City.Id", data.address?.city?.id.toString());
  //     formData.append("Address.City.Name", data.address?.city?.name);
  //     formData.append(
  //       "Address.City.State.Id",
  //       data.address?.city?.state?.id.toString()
  //     );
  //     formData.append("Address.City.State.Name", data.address?.city?.state?.name);
  //     formData.append(
  //       "Address.City.State.Country.Id",
  //       data.address?.city?.state?.country?.id.toString()
  //     );
  //     formData.append(
  //       "Address.City.State.Country.Name",
  //       data.address?.city?.state?.country?.name
  //     );
  //     selectedPlan?.forEach((plan, index) => {
  //       formData.append(`HealthPlans[${index}][id]`, plan.id.toString());
  //       formData.append(`HealthPlans[${index}][name]`, plan.name);
  //     });

  //     try {
  //       const patientRepository = createApiPatientRepository();
  //       const updatePatientFn = updatePatient(patientRepository);
  //       const patientCreationPromise = updatePatientFn(formData, Number(id));

  //       toast.promise(patientCreationPromise, {
  //         loading: "Creando paciente...",
  //         success: "Paciente creado con éxito!",
  //         error: "Error al crear el Paciente",
  //       });

  //       patientCreationPromise
  //         .then(() => {
  //           goBack();
  //         })
  //         .catch((error) => {
  //           console.error("Error al crear el paciente", error);
  //         });
  //     } catch (error) {
  //       console.error("Error al crear el paciente", error);
  //     }
  //   };

  //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0] || null;
  //     setSelectedFile(file);
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setImagePreviewUrl(reader.result as string);
  //       };
  //       reader.readAsDataURL(file);
  //     } else {
  //       setImagePreviewUrl(null);
  //     }
  //   };

  //   const handleDateChange = (date: Date) => {
  //     const dateInArgentina = moment(date).tz("America/Argentina/Buenos_Aires");
  //     const formattedDateISO = dateInArgentina.format();
  //     setStartDate(date);
  //     setValue("birthDate", formattedDateISO);
  //   };

  return (
    <>
      <div className="w-1/2 p-6 mt-4 items-center justify-center border shadow-xl rounded-lg max-w-4xl mx-auto bg-white">
        <div className="my-4">
          <div className="flex items-center justify-center text-black font-bold text-xl">
            <button
              className="flex items-center justify-start py-2 px-4 w-full"
              onClick={() => window.history.back()}
            >
              <IoMdArrowRoundBack className="text-black mr-2" size={24} />
              Editar Jugador
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="group rounded-2xl overflow-hidden">
              <img
                src={
                  user?.photo
                    ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${user.photo}.jpeg`
                    : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/default2.png"
                }
                alt="Imagen del Paciente"
                width={100}
                height={100}
                className="rounded-2xl"
              />

              <div className="absolute bottom-0 right-0 mb-2 mr-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                <div
                  className="bg-black p-2 rounded-full cursor-pointer"
                  //   onClick={() => inputFileRef?.current?.click()}
                >
                  <FaCamera className="text-white" />
                  <input
                    type="file"
                    style={{ display: "none" }}
                    // ref={inputFileRef}
                    // onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center rounded-lg">
          <div className="w-full p-4">
            <h1 className="text-xl font-semibold mb-4">Datos Personales</h1>
            {/* <form onSubmit={handleSubmit(onSubmit)}> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  // {...register("firstName", { required: true })}
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                  defaultValue={user?.name}
                />
              </div>
              <div>
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                  // {...register("lastName", { required: true })}
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                  defaultValue={user?.lastname}
                />
              </div>
            </div>

            <h1 className="text-xl font-semibold mb-4">Contacto</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                  // {...register("email")}
                  defaultValue={user?.email}
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  // {...register("phoneNumber", { required: true })}
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                  defaultValue={user?.phone}
                />
              </div>
            </div>

            <h1 className="text-xl font-semibold mb-4">Ubicación</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="state">Provincia</Label>
                <StateSelect
                  selected={selectedState}
                  onStateChange={handleStateChange}
                />
              </div>
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <CitySelect
                  idState={selectedState}
                  selected={selectedCity}
                  onCityChange={handleCityChange}
                />
              </div>
            </div>

            <h1 className="text-xl font-semibold mb-4">Estadísticas</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <Label htmlFor="street">Ranking Inicial</Label>
                <Input
                  // // {...register("address.street")}
                  className="bg-gray-200"
                  // defaultValue={user?.address.street}
                />
              </div>

              <div>
                <Label htmlFor="number">Categoría</Label>
                <Input
                  // // {...register("address.number")}
                  className="bg-gray-200"
                  // defaultValue={user?.address.number}
                />
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <Button
                className="mt-10 m-2"
                variant="destructive"
                onClick={goBack}
              >
                Cancelar
              </Button>
              <Button className=" m-2">Confirmar</Button>
            </div>
            {/* </form> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditPlayerForm;
