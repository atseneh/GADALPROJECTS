function formatNumbers(num:number) {
    if (Math.abs(num) >= 1e9) {
      return (num / 1e9).toFixed(2) + "B";
    } else if (Math.abs(num) >= 1e6) {
      return (num / 1e6).toFixed(2) + "M";
    } else if (Math.abs(num) >= 1e3) {
      return (num / 1e3).toFixed(2) + "K";
    } else {
      return num?.toString();
    }
  }
  export default formatNumbers