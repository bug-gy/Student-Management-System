import { FeedbackForm } from "../models/FeedbackForm.js";
import { FeedbackResponse } from "../models/FeedbackResponse.js";
import { ApiError } from "../utils/ApiError.js";

export class FeedbackService {
  async listForms(query: { subject?: string; teacher?: string; status?: string }) {
    const filter: Record<string, unknown> = {};
    if (query.subject) filter.subject = query.subject;
    if (query.teacher) filter.targetTeacher = query.teacher;
    if (query.status === "all") {
      // show all
    } else if (query.status === "archived") {
      filter.isArchived = true;
    } else {
      filter.isArchived = { $ne: true };
    }

    return FeedbackForm.find(filter)
      .populate("subject", "name code")
      .populate("targetTeacher", "name")
      .sort({ createdAt: -1 })
      .lean();
  }

  async createForm(data: {
    title: string;
    subject?: string;
    targetTeacher?: string;
    questions: { questionText: string; type: string; options?: string[] }[];
    openDate: string;
    closeDate: string;
    createdBy: string;
  }) {
    return FeedbackForm.create({
      ...data,
      openDate: new Date(data.openDate),
      closeDate: new Date(data.closeDate),
    });
  }

  async submitFeedback(formId: string, answers: { questionText: string; type: string; value: string | number }[]) {
    const form = await FeedbackForm.findById(formId);
    if (!form) throw ApiError.notFound("Feedback form not found");

    const now = new Date();
    if (now < form.openDate || now > form.closeDate) {
      throw ApiError.badRequest("Feedback form is not currently open");
    }

    return FeedbackResponse.create({ form: formId, answers });
  }

  async getResults(formId: string) {
    const form = await FeedbackForm.findById(formId)
      .populate("subject", "name")
      .populate("targetTeacher", "name");
    if (!form) throw ApiError.notFound("Feedback form not found");

    const responses = await FeedbackResponse.find({ form: formId }).lean();

    const aggregated = form.questions.map((question) => {
      const answers = responses.map((r) =>
        r.answers.find((a) => a.questionText === question.questionText),
      ).filter(Boolean);

      if (question.type === "rating") {
        const numericValues = answers.map((a) => Number(a!.value)).filter((v) => !isNaN(v));
        const average = numericValues.length > 0
          ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length
          : 0;
        return { question: question.questionText, type: question.type, average, count: numericValues.length };
      }

      if (question.type === "multiple_choice") {
        const counts: Record<string, number> = {};
        answers.forEach((a) => {
          const val = String(a!.value);
          counts[val] = (counts[val] ?? 0) + 1;
        });
        return { question: question.questionText, type: question.type, counts };
      }

      return { question: question.questionText, type: question.type, responses: answers.map((a) => a!.value) };
    });

    return { form, aggregated, totalResponses: responses.length };
  }

  async updateForm(id: string, data: Record<string, unknown>) {
    if (data.openDate) data.openDate = new Date(data.openDate as string) as unknown as Date;
    if (data.closeDate) data.closeDate = new Date(data.closeDate as string) as unknown as Date;
    const form = await FeedbackForm.findByIdAndUpdate(id, data, { new: true });
    if (!form) throw ApiError.notFound("Feedback form not found");
    return form;
  }

  async archiveForm(id: string) {
    const form = await FeedbackForm.findByIdAndUpdate(id, { isArchived: true }, { new: true });
    if (!form) throw ApiError.notFound("Feedback form not found");
    return form;
  }

  async restoreForm(id: string) {
    const form = await FeedbackForm.findByIdAndUpdate(id, { isArchived: false }, { new: true });
    if (!form) throw ApiError.notFound("Feedback form not found");
    return form;
  }

  async exportResults(formId: string) {
    return this.getResults(formId);
  }
}
