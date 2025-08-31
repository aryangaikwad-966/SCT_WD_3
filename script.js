(() => {
      const boardEl = document.getElementById('board');
      const turnEl = document.getElementById('turn');
      const scoreX = document.getElementById('score-x');
      const scoreO = document.getElementById('score-o');
      const scoreD = document.getElementById('score-d');

      const modeHumanBtn = document.getElementById('mode-human');
      const modeAIBtn = document.getElementById('mode-ai');
      const resetBtn = document.getElementById('reset');

      let board = Array(9).fill(''); 
      let cur = 'X';
      let running = true;
      let vsAI = true; 
      let scores = { X:0, O:0, D:0 };

      const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];

      function createBoard(){
        boardEl.innerHTML = '';
        for(let i=0;i<9;i++){
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.index = i;
          cell.addEventListener('click', onCellClick);
          boardEl.appendChild(cell);
        }
      }

      function onCellClick(e){
        const i = Number(e.currentTarget.dataset.index);
        if(!running || board[i]) return;
        makeMove(i, cur);
        if(checkWin(cur)) return endRound(cur);
        if(board.every(v=>v)) return endRound('D');
        cur = cur === 'X' ? 'O' : 'X';
        updateTurn();

        if(vsAI && cur === 'O'){
         
          setTimeout(()=>{ aiMove(); }, 300);
        }
      }

      function makeMove(i, player){
        board[i] = player;
        const cell = boardEl.querySelector('[data-index="'+i+'"]');
        cell.textContent = player;
        cell.classList.add('disabled');
      }

      function checkWin(player){
        return wins.some(combo => combo.every(idx => board[idx] === player));
      }

      function highlightWin(player){
        const combo = wins.find(c => c.every(i => board[i] === player));
        if(!combo) return;
        combo.forEach(i => {
          const el = boardEl.querySelector('[data-index="'+i+'"]');
          el.classList.add('highlight');
        });
      }

      function endRound(winner){
        running = false;
        if(winner === 'D'){
          scores.D++;
          scoreD.textContent = scores.D;
          turnEl.textContent = 'It\'s a draw.';
        } else {
          scores[winner]++;
          if(winner === 'X') scoreX.textContent = scores.X;
          else scoreO.textContent = scores.O;
          highlightWin(winner);
          turnEl.textContent = (winner === 'X' ? 'X wins!' : 'O wins!');
        }
      }

      function updateTurn(){
        turnEl.textContent = running ? 'Turn: ' + cur : 'Game over';
      }

      function resetBoard(){
        board = Array(9).fill('');
        cur = 'X';
        running = true;
        updateTurn();
        createBoard();
      }

      function aiMove(){
        if(!running) return;
        const ai = 'O', pl = 'X';

        function findWinningMove(p){
          for(const combo of wins){
            const vals = combo.map(i=>board[i]);
            const emptyIdx = combo.find(i => board[i] === '');
            if(emptyIdx !== undefined){
              const filled = combo.filter(i => board[i] === p).length;
              if(filled === 2) return emptyIdx;
            }
          }
          return null;
        }

      
        let move = findWinningMove(ai);
       
        if(move === null) move = findWinningMove(pl);
      
        if(move === null && board[4] === '') move = 4;
      
        const corners = [0,2,6,8].filter(i=>board[i]==='');
        if(move === null && corners.length) move = corners[Math.floor(Math.random()*corners.length)];
      
        const sides = [1,3,5,7].filter(i=>board[i]==='');
        if(move === null && sides.length) move = sides[Math.floor(Math.random()*sides.length)];
       
        if(move === null){
          const empties = board.map((v,i)=>v===''?i:-1).filter(i=>i>=0);
          move = empties[Math.floor(Math.random()*empties.length)];
        }

        if(move !== null && move !== undefined) {
          makeMove(move, ai);
          if(checkWin(ai)) return endRound(ai);
          if(board.every(v=>v)) return endRound('D');
          cur = 'X';
          updateTurn();
        }
      }

   
      modeHumanBtn.addEventListener('click', ()=>{ vsAI = false; modeHumanBtn.classList.add('active'); modeAIBtn.classList.remove('active'); resetBoard(); });
      modeAIBtn.addEventListener('click', ()=>{ vsAI = true; modeAIBtn.classList.add('active'); modeHumanBtn.classList.remove('active'); resetBoard(); });
      resetBtn.addEventListener('click', ()=>{ resetBoard(); });

      createBoard();
      updateTurn();

 
      window._ttt = { board, resetBoard, makeMove };
    })();
