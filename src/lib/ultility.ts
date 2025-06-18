export const calculateAge = (dateOfBirth?: string | Date) => {
    if (!dateOfBirth) return undefined; // Hoặc return 0 tuỳ yêu cầu
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return undefined; // Không phải ngày hợp lệ
  
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };