<script lang="ts">
  /** @type {import('./$types').PageData} */
  export let data;
  import './style.css';
  import DayButton from '$/lib/components/DayButton.svelte';
  import { getWeekOfDate } from '$/lib/helpers/getWeekOfDate';
  import { onMount } from 'svelte';

  const doneIt = (data.res as { date: string; didit: 1 | 0 }[]).map((date) => {
    return { date: date.date, didIt: date.didit === 1 };
  });

  function previouslyDidIt(date2: Date) {
    // date is within 12 hours to account for db timezone difference i think?
    return !!doneIt.find((date1) => Math.abs(new Date(date1.date).getTime() - date2.getTime()) < 12 * 1000 * 3600)
      ?.didIt;
  }

  const firstDayOfTheYear = new Date(new Date().getFullYear(), 0, 1);
  const firstWeekOfTheYear = getWeekOfDate(firstDayOfTheYear);

  function lastYearDaysInFirstWeek() {
    const firstWeek = [];
    for (let i = 0; i < dayOfWeek(firstDayOfTheYear); i++) {
      firstWeek.push({ week: firstWeekOfTheYear, date: undefined, checked: false });
    }
    return firstWeek;
  }

  function datesInYear() {
    const dates = [{ date: firstDayOfTheYear, week: firstWeekOfTheYear, checked: previouslyDidIt(firstDayOfTheYear) }];
    while (dates.length < 400) {
      const lastDate = dates.at(-1)!.date;
      const nextDate = new Date(lastDate.setDate(lastDate.getDate() + 1));
      const onFinalDate = dates[10] && nextDate.getFullYear() > dates[10].date.getFullYear();
      if (onFinalDate) break;
      dates.push({ date: nextDate, week: getWeekOfDate(nextDate), checked: previouslyDidIt(nextDate) });
    }
    return dates;
  }

  function dayOfWeek(date: Date) {
    const day = date.getDay() - 1 > -1 ? date.getDay() - 1 : 6;
    return day;
  }

  const dates: { date: Date | undefined; week: number; checked: boolean }[] = [];
  dates.push(...lastYearDaysInFirstWeek());
  dates.push(...datesInYear());

  onMount(() => {
    const REM = 16;
    const GAP = window.innerWidth > 600 ? REM : 0.5 * REM;
    const INPUT = window.innerWidth > 600 ? REM * 3 : REM * 2;
    window.scroll({ top: (INPUT + GAP) * getWeekOfDate(new Date()), behavior: 'smooth' });
  });
</script>

<svelte:head>
  <title>Do it</title>
</svelte:head>

<div class="wrapper">
  <div class="days-grid">
    <span />
    <span class="day-label">M</span>
    <span class="day-label">T</span>
    <span class="day-label">O</span>
    <span class="day-label">T</span>
    <span class="day-label">F</span>
    <span class="day-label">L</span>
    <span class="day-label">S</span>
    <span />
    {#each dates as date, i}
      {#if i % 7 === 0}
        {#if i !== 0}
          <span class="week-number hide">{date.week}</span>
        {/if}
        <span class="week-number">{date.week}</span>
      {/if}
      {#if !date.date}
        <DayButton faded />
      {:else}
        <DayButton previouslyChecked={date.checked} date={date.date} />
      {/if}
    {/each}
  </div>
</div>

<!-- <div class="line" /> -->
<style>
  /* .line {
    position: fixed;
    top: calc(50% - 1.5rem);
    height: 3rem;
    width: 100%;
    background-color: mediumseagreen;
    opacity: 0.5;
  } */
  .wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    height: 100%;
    padding-top: calc(50vh - 1.5rem);
    padding-right: 1rem;
    padding-left: 1rem;
    box-sizing: border-box;
  }

  .days-grid {
    transform: translateY(-36px);
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 1rem;
    width: min-content;
    align-items: center;
    padding-bottom: calc(50vh - 1.5rem);
    height: fit-content;
  }

  .day-label {
    text-align: center;
    height: 20px;
  }

  .week-number {
    text-align: right;
    margin-right: 0.5rem;
  }

  .hide {
    opacity: 0;
    pointer-events: none;
  }

  @media screen and (max-width: 600px) {
    .days-grid {
      gap: 0.5rem;
      transform: translateY(-28px);
    }
  }
</style>
