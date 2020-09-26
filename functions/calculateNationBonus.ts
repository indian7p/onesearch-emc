export default function(nation) {
  if (nation) {
    const val = nation.residents;
    switch (true) {
      case (val > 0 && val <= 9):
        return 10;
      case (val >= 10 && val <= 19):
        return 20;
      case (val >= 20 && val <= 29):
        return 40;
      case (val >= 30 && val <= 39):
        return 60;
      case (val >= 40 && val <= 59):
        return 100;
      case (val >= 60):
        return 140;
    }
  } else {
    return 0;
  }
}
