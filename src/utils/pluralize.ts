const pluralRules = new Intl.PluralRules();

function pluralize(number: number, singularForm: string, pluralForm: string) {
  return pluralRules.select(number) === "one" ? singularForm : pluralForm;
}

export default pluralize;
