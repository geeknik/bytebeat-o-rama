import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BytebeatFAQ = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="what-is-bytebeat">
        <AccordionTrigger>What is a Bytebeat?</AccordionTrigger>
        <AccordionContent>
          Bytebeat is a form of algorithmic music where audio is generated through mathematical expressions and bitwise operations. Each sample is calculated using a time variable 't', creating unique patterns that result in musical sounds. The technique was popularized by viznut in 2011.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="how-it-works">
        <AccordionTrigger>How does it work?</AccordionTrigger>
        <AccordionContent>
          Each algorithm generates audio samples by performing mathematical operations on a time variable 't'. The sample rate determines how quickly 't' increments. The resulting values are converted to audio samples, creating various musical patterns and rhythms through pure mathematics.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="sample-rate">
        <AccordionTrigger>What is Sample Rate?</AccordionTrigger>
        <AccordionContent>
          The sample rate controls how many audio samples are generated per second. Higher sample rates (e.g., 44100 Hz) result in higher-quality audio but faster playback, while lower rates (e.g., 8000 Hz) create lower-pitched, slower variations of the same pattern.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="algorithms">
        <AccordionTrigger>What do the different algorithms do?</AccordionTrigger>
        <AccordionContent>
          Each algorithm uses different mathematical formulas to create unique sound patterns. Some focus on creating rhythmic beats, others on melodic patterns, and some explore experimental mathematical concepts. Try different algorithms and sample rates to discover new sounds!
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default BytebeatFAQ;