<script lang="ts">
  
  import { goto } from '$app/navigation';
  export let workshop_name='Workshop';
  export let workshop_id:string;
  export let img_url;

  function handleClick(){
    window.location.href = (`/workshop/?id=${workshop_id}`)
  }




</script>

 

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="individualContainer" on:click={()=>handleClick()}>
  <div class="inner">
    <div class="image">
      <img class="image1" alt="logo" src={img_url}>
      <div class="content">
        <p class="heading">{workshop_name}</p>
        <!-- <div class="btn">
            <button type="button" class="info_btn">More Info<Icon data={play} scale={0.9}/></button>
            <button type="button" class="register_btn">Register</button>
        </div> -->
      </div>
    </div>
    
  </div>
</div>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .individualContainer {
    float: left;
    min-width: max(20vw,250px);
    max-width: 300px;
    box-sizing: border-box;
    border: 1px solid transparent; 
    overflow: hidden;
    position: relative; 
  }

  .inner {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;
    padding: 1%;
    /* margin: 1%; */
    overflow: hidden;
    position: relative;
    border: 1px solid transparent;
  }

  .image {
    bottom: 0;
    position: relative; 
    margin-left: 3%;
    overflow: hidden;
    padding-left: 5%;
    padding-bottom: 5%;
    left: 30px;
    top: -30px;
    width: 100%;
    /* z-index: 4; */
    border: 1px solid transparent; 
    display: flex;
    flex-direction: column;
    /* z-index: 2;  */
  }

  .workshop_image {
    overflow: hidden;
    height: 200px;
    /* border: 1px solid blue;  */
  }

  .outline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 90%;
    width: 90%;
    z-index: 1; 
    border: 1.4px solid rgb(252, 252, 250); 
    box-sizing: border-box; 
    display: flex;
    flex-direction: column;
    clip-path: polygon(0% 0%,4% 0%, 4% 65%, 100% 65%,100% 100%, 0% 100%);
  }
  .content{
   
    margin-right: 12%;
  }

.heading{
  margin-top: 5%;
  padding: 2%;
  pointer-events: none;
  font-size: medium;
  font-weight: bolder;
  
}

.btn{
  display: flex;
  align-items: center;
  margin-top: 15%;
  padding-top: 2%;
  /* border: 1px solid green; */
  align-items: center;
  /* gap: 10%; */
  padding-right: 9%;
  overflow: hidden;
  gap: 10%;
}

.info_btn{
  display: flex;
  color: white;
  width: 47%;
  background: transparent;
  font-size: small;
  font-weight: 300;
  align-items: center;
  justify-content: center;
  padding: 0.7vh;
  border: 1px solid white;
  border-radius: 15px;
  
  gap: 0.3rem;
}


.register_btn{
    color: white;
    width: 40%;
    font-weight: 700;
    padding: 0.4rem;
    padding-left: 0.9rem;
    padding-right: 0.9rem;
    background: linear-gradient(99.74deg, #06dbac, #bd00ff);
    border-radius: 15px;
    border: none;
}
  .image1 {
    height: 200px;
    width: 100%;
    pointer-events: none;
    transition: all 0.25s ease-in-out;
  }
</style>
