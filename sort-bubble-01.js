
var assert = require('assert');
var assert = require('assert');

function getRandInt(min, max) {
  //console.log(`inside getRandInt( min:${min}, max:${max} )`);

  if( min>max){
    const tmp=min;
    min=max;
    max=tmp;
  }
  min = Math.ceil(min);
  max = Math.floor(max);

  // console.log(`    ret:${ret}`);
  // console.log();
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randn_bm(min, max, skew) {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}

const getRandIntArray = (min,max) => {
  if( min>max){
    const tmp=min;
    min=max;
    max=tmp;
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Array(end - start + 1).fill().map((item, index) => start + index);
}

function rand_fill(size){
  console.log(`inside rand_fill(size:${size})`);

  let arr=[];
  size = Math.floor(size);

  console.log('     size:',size);

  for( let i=0; i<size; ++i ){
    arr.push( getRandInt(1,size) );
    // console.log(arr);
  }
  console.log(arr);
  return arr; 
}

function seq_fill(size){
  console.log(`inside seq_fill(size:${size})`);
  let arr=[];
  for( let i=0; i<size; ++i) arr.push(i);
  return arr;
}

function rand_seq_fill(size){
  console.log(`inside rand_seq_fill(size:${size})`);
  let arr=[];
  arr.push(0);
  for( let i=1; i<size; ++i )
    arr.splice(getRandInt(0,i),0,i);
  arr.sort( (a,b)=>{Math.random()-0.5} );
  return arr;
}

let stat = {comp:0,assign:0,inc:0};

function swap(a,b,c,s){
  const t=a[b];
  a[b]=a[c];
  a[c]=t;
  s.assign += 3;
}

function bubble_naive( arr, stat ){
  let ar = [...arr];  
  // console.log('stats:',stat);
                                               stat.assign++;
  for( let end = ar.length; 0<end-1; --end ){  stat.comp++; stat.inc+=2;

                                               stat.assign +=2;
    for( let j=0,k=j+1; k<end; ++j,++k ){      stat.comp++; stat.inc +=2;
                                               stat.comp++;
      if( ar[j]>ar[k]){                        
        swap(ar,j,k,stat);
      }
    }
  }
  return ar;
}

function shaker_naive( arr, stat ){
  // console.log('========================');
  // console.log(`inside shaker_naive(arr)`);
  // console.log('...  arr:',arr);

  let ar = [...arr];
  //let beg = 0;
  // console.log('stats:',stat);
  let end = ar.length;                      stat.assign++;
  // let sc=0;
  // let outer_loops=0;
  // let inner_loops=0;
                                            stat.assign++;
  for( let beg=0; beg<end-1; ++beg,--end ){ stat.comp++; stat.inc += 2;

    let j=beg;                              stat.assign += 2;
    let k=j+1;
    // console.log('=========');
    // console.log(`    outer loops:${++outer_loops}`);

    // console.log('-------------');
    // console.log(`      inner loops:${++inner_loops}`);

    // console.log('      up ==>> j:',j,'k:',k);
    // console.log('        ar:',ar);
    for( ; k<end; ++j,++k ){               stat.comp++; stat.inc += 2;
      if( ar[j]>ar[k]){                    stat.comp++;
        swap(ar,j,k,stat);
      }
    }
    --j,--k;                               stat.inc += 2;
    for( ; j>=beg; --j,--k ){              stat.comp++; stat.inc += 2;

                                           stat.comp++;
      if( ar[k]<ar[j]){
        swap(ar,j,k,stat);
      }
    }
  }
  return ar;
}

function sp(n){
  return ''.padEnd(n,' ');
}

let depth = 0;
function quicksort_midpivot( a, stat ) {
  ++depth;
  console.log( '  '+ sp(depth*2) + '. qs');
  console.log( '  '+ sp(depth*2) + '.       a:', arrayToStr(a) );
  if(depth>20){
    console.log('depth:',depth,', too deep exiting');
    return [];
  }
  let ret = undefined;
  switch( a.length) {
    case 0: case 1: 
      console.log( '  '+ sp(depth*2) + '.       a:', '  nothing to do...' );
      --depth; 
      return a;

    case 2: case 3:
      console.log( '  '+ sp(depth*2) + '.       a:', '  bubble sort it' );
      ret = bubble_naive( a, stat );
      console.log( '  '+ sp(depth*2) + '.       a:', arrayToStr(ret) );
      --depth; 
      return ret;

    case 4: case 5: case 6: case 7: 
      console.log( '  '+ sp(depth*2) + '.       a:', '  shaker sort it' );
      ret = shaker_naive( a, stat );
      console.log( '  '+ sp(depth*2) + '.       a:', arrayToStr(ret) );
      --depth; 
      return ret;
      
    default:
  }
  let pivi = Math.trunc(a.length/2);            //stat.assign++;
  swap( a, 0, pivi, stat );
  console.log( '  '+ sp(depth*2) + '.       a:', '  pivot to front...' );
  console.log( '  '+ sp(depth*2) + '.       a:', arrayToStr(a ) );
  console.log( '  '+ sp(depth*2) + '.       a:', '  pivot' );

  let piv = a[0];                               //stat.assign += 3;
  let beg = 1;
  let end = a.length-1;
  let pivei = 1;
                                                stat.comp++;
  for( ; beg<end ; ){                           stat.comp++; 
    // if(      a[end] >  piv ) --end;
    // else if( a[beg] <= piv ) ++beg;
    // else                     swap(a,beg,end);
                                                stat.comp++;
    if( a[end] >  piv ){                        //stat.comp++;
      --end;                                    stat.inc++;
    }else{                                      stat.comp++;
      if( a[beg] < piv ){                      
        ++beg;                                  stat.inc++;
      }
      else {
        if( a[beg] === piv )
        {
          if( beg != pivei ) {
            swap(a,pivei,beg,stat);
          }
          ++beg;
          ++pivei;
        }
        else {
          swap(a,beg,end,stat);
        }
      }
    }
  }
  console.log( '  '+ sp(depth*2) + '.       a:', arrayToStr(a ) );
  let pivcount = pivei;
  --pivei;
  console.log( '  '+ sp(depth*2) + '.       a:   pivots to the middle' );
  console.log( '  '+ sp(depth*2) + '.       a:', `   piv:${pivei}, beg:${beg}, end:${end}` );
  while( pivei >= 0 ) {
    swap(a,pivei,beg,stat);
    --pivei;
    --end;
  }
  //console.log( '  '+ sp(depth*2) + '.  a:',a);
  let a1 = a.slice(0,end+1);
  let a2pivot = a.slice(end+1,end+1+pivcount);
  let a3 = a.slice(end+2+pivcount);
  console.log( '  '+ sp(depth*2) + '.       a:', arrayToStr(a ) );
  console.log( '  '+ sp(depth*2) + '. pre  a1:', arrayToStr(a1) );
  console.log( '  '+ sp(depth*2) + '. pre  a2:', arrayToStr(a2pivot) );
  console.log( '  '+ sp(depth*2) + '. pre  a3:', arrayToStr(a3) );

  let a4 = quicksort_midpivot( a1, stat );
  let a5 = quicksort_midpivot( a3, stat );

  // console.log( '  '+ sp(depth*2) + '. post a1:',a1);
  // console.log( '  '+ sp(depth*2) + '. post a2:',a2);
  
  ret = a4.concat( a2pivot ).concat( a5 );
  //let ret = quicksort_midpivot( a.slice(0,end-1) ).concat( quicksort_midpivot( a.slice(end) ) );
  //console.log( '  '+ sp(depth*2) + '.ret:',ret);
  --depth;
  return ret;
}

function arrayToStr(a){
  if( Array.isArray(a) ){
    let ret = '[';
    switch(a.length){
      case 0: ret +='(empty)'; break;
      case 1: ret += a[0]; break;
      default:
        ret += a[0];
        for(let i=1;i<a.length;++i){
          if( a[i]<10) ret += ' ';
          ret += ', ' + a[i];
        }
        break;
    }
    ret += ']';
    return ret;
  }else{
    return '' + a;
  }
}

function bubble_less_naive(arr){
  console.log(`inside bubble_less_naive(arr)`);
  console.log('...  arr:',arr);

  let a = [...arr];
  let end = a.length;
  
  for( ; end>0; --end){
    let i=0,j=i+1;
    console.log('--------------');
    console.log(`     end:${end}`);
    for( ; j<end; ++i,++j){
      if( a[i] > a[j] ){ // ++cmp
        console.log(`     a[i:${i}]:${a[i]}, a[j:${j}]:${a[j]}`);
        break;
      }
    }
    console.log(`     i:${i},j:${j}`)
    let t=a[i]; // ++assign
    a[i] = a[j]; // ++assign
    a[j] = -1; // debug
    console.log(`     a[i:${i}]:${a[i]}, t:${t}, a[j:${j}]:${a[j]}`);
    ++i,++j;
    console.log(`     a[i:${i}]:${a[i]}, t:${t}, a[j:${j}]:${a[j]}`);
    for(;j<end;++i,++j) { 
      if( t > a[j] ){
        console.log(`     swap t`);
        a[i] = t;
        t = a[j];
        a[j] = -1;
        console.log(`     a[i:${i}]:${a[i]}, t:${t}, a[j:${j}]:${a[j]}`);
      }
      else{
        a[i] = a[j];
        a[j] = -1;
        console.log(`     swap i <<== j`);
        console.log(`     a[i:${i}]:${a[i]}, t:${t}, a[j:${j}]:${a[j]}`);
      }
    }
    console.log('      a:',a);
  }
  return a;
}

let ar = [];
ar = rand_fill(20);
let arev = [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];

// console.log('    ar:',ar)

stat.comp=0; stat.assign=0; stat.inc=0;
console.log('==================================');
console.log('bubble:', bubble_naive( ar, stat ) );
console.log('bubble stats:',stat);
console.log('');

stat.comp=0; stat.assign=0; stat.inc=0;
console.log('==================================');
console.log('shaker:', shaker_naive( ar, stat ) );
console.log('shaker stats:',stat);
console.log('');

stat.comp=0; stat.assign=0; stat.inc=0;
console.log('==================================');
console.log('s rev:', shaker_naive( arev, stat ) );
console.log('s rev stats:',stat);
console.log('');

stat.comp=0; stat.assign=0; stat.inc=0;
console.log('==================================');
console.log('quicksort:', quicksort_midpivot(ar,stat) );
console.log('quicksort stats:',stat);
console.log('');

stat.comp=0; stat.assign=0; stat.inc=0;
console.log('==================================');
console.log('quicksort rev:', quicksort_midpivot(arev,stat) );
console.log('quicksort stats:',stat);
console.log('');

