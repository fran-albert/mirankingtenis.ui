export function capitalizeWords(input: any) {
  return input.toLowerCase().replace(/(?:^|\s)\S/g, function (a: any) { return a.toUpperCase(); });
}

export function formatTournamentDates(startDate: string | Date, endDate: string | Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };

  const start = new Date(startDate);
  const end = new Date(endDate);

  const formattedStart = start.toLocaleDateString('es-ES', options);
  const formattedEnd = end.toLocaleDateString('es-ES', options);

  const year = start.getFullYear();

  return `${formattedStart} - ${formattedEnd}, ${year}`;
}

export function getInitials(name: string, lastName: string): string {
  const nameInitial = name.charAt(0).toUpperCase();
  const lastNameInitial = lastName.charAt(0).toUpperCase();
  return `${nameInitial}${lastNameInitial}`;
}

export function formatDateToSpanish(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('es-ES', options);

  // Capitaliza el mes
  const [day, month, year] = formattedDate.split(' ');
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  return `${day} ${capitalizedMonth}, ${year}`;
}
