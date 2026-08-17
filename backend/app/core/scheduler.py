from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.core.database import async_session_factory
from app.core.logging import get_logger

logger = get_logger(__name__)

scheduler = AsyncIOScheduler()


async def run_prayer_refresh() -> None:
    from app.modules.prayer.service import fetch_prayer_times

    logger.info("Scheduled prayer times refresh triggered")
    try:
        await fetch_prayer_times()
    except Exception:
        logger.exception("Scheduled prayer times refresh failed")


async def run_recurrence_reset() -> None:
    from app.modules.tasks.recurrence import reset_recurring_tasks

    logger.info("Scheduled recurring task reset triggered")
    async with async_session_factory() as session:
        try:
            await reset_recurring_tasks(session)
            await session.commit()
        except Exception:
            await session.rollback()
            logger.exception("Scheduled recurring task reset failed")


async def run_rotation() -> None:
    from app.modules.tasks.rotation import rotate_tasks

    logger.info("Scheduled rotation triggered")
    async with async_session_factory() as session:
        try:
            await rotate_tasks(session)
            await session.commit()
        except Exception:
            await session.rollback()
            logger.exception("Scheduled rotation failed")


async def run_cleanup() -> None:
    from app.modules.cleanup.service import cleanup_old_records

    logger.info("Scheduled cleanup triggered")
    async with async_session_factory() as session:
        try:
            await cleanup_old_records(session)
            await session.commit()
        except Exception:
            await session.rollback()
            logger.exception("Scheduled cleanup failed")


def setup_scheduler() -> None:
    scheduler.add_job(
        run_rotation,
        trigger=CronTrigger(day_of_week="mon", hour=0, minute=0),
        id="weekly_task_rotation",
        replace_existing=True,
    )
    scheduler.add_job(
        run_recurrence_reset,
        trigger=CronTrigger(hour=0, minute=1),
        id="daily_recurrence_reset",
        replace_existing=True,
    )
    scheduler.add_job(
        run_prayer_refresh,
        trigger=CronTrigger(hour=1, minute=0),
        id="daily_prayer_refresh",
        replace_existing=True,
    )
    scheduler.add_job(
        run_cleanup,
        trigger=CronTrigger(hour=2, minute=0),
        id="daily_cleanup",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler started: recurrence reset daily at 00:01, task rotation every Monday at midnight, prayer times refresh daily at 1am, cleanup daily at 2am")


def shutdown_scheduler() -> None:
    scheduler.shutdown(wait=False)
    logger.info("Scheduler shut down")
