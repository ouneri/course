using System.Text.Json.Serialization;

namespace CMQuiz.Web.API.Models;

[JsonDerivedType(typeof(QuizItemSelectModel), typeDiscriminator: "select")]
[JsonDerivedType(typeof(QuizItemTextModel), typeDiscriminator: "text")]
[JsonDerivedType(typeof(QuizItemRangeModel), typeDiscriminator: "range")]
[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
public abstract class QuizItemModel
{
    [JsonPropertyName("type")]
    public abstract string Type { get; }
    public int Id { get; set; }
    public int QuizId { get; set; }
}
