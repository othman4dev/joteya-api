for (let i = 0; i < 9999; i++) {
  setTimeout(() => {
    console.log('async');
  }, 1);
  setTimeout(() => {
    console.log(i);
  }, 0);
}
