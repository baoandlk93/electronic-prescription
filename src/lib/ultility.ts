export const calculateAge = (dateOfBirth?: string | Date) => {
  console.log(dateOfBirth, "dateOfBirth");
    if (!dateOfBirth) return undefined; // Hoặc return 0 tuỳ yêu cầu
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return undefined; // Không phải ngày hợp lệ
  
    const today = new Date();
    console.log(today, "today");
    let age = today.getFullYear() - birthDate.getFullYear();
    console.log(age, "age");
    const monthDiff = today.getMonth() - birthDate.getMonth();
    console.log(monthDiff, "monthDiff");
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    console.log(age, "age");
    return age;
  };