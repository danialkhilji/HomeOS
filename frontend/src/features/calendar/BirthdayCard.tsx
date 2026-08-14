import { Card, LoadingSpinner } from "../../components";
import { useUpcomingBirthdays } from "../../hooks/useBirthdays";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function BirthdayCard() {
  const { data: birthdays = [], isLoading } = useUpcomingBirthdays(7);

  if (!isLoading && birthdays.length === 0) return null;

  return (
    <Card title="🎂 Upcoming Birthdays">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-2">
          {birthdays.map((bday) => (
            <div key={bday.id} className="flex items-center justify-between py-1.5">
              <span className="text-base text-text">
                {bday.name}
              </span>
              <span className="text-sm text-text-muted">
                {bday.day} {MONTHS[bday.month - 1]}
                {bday.days_until === 0
                  ? " — Today!"
                  : bday.days_until === 1
                    ? " — Tomorrow"
                    : ` — in ${bday.days_until} days`}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
